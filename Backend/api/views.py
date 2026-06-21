from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document
import PyPDF2
import docx
from bs4 import BeautifulSoup
import requests
from io import BytesIO
import yake
import hashlib
from django.db import IntegrityError

def extract_text_from_pdf(file_obj):
    file_obj.seek(0)
    pdf_reader = PyPDF2.PdfReader(file_obj)
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

def extract_text_from_docx(file_obj):
    file_obj.seek(0)
    document = docx.Document(BytesIO(file_obj.read()))
    text = "\n".join([p.text for p in document.paragraphs])
    return text

def extract_text_from_url(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    text = soup.get_text(separator="\n")
    return text

class ProcessDocumentView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        print("ProcessDocumentView POST request, user:", request.user)
        file_obj = request.FILES.get('file')
        url = request.data.get('url')
        text_content = ""
        filename = None

        # --- Content Extraction ---
        if file_obj:
            filename = file_obj.name
            if filename:
                filename = filename[:255]  # Ensure max length is 255
            print("File uploaded, filename:", filename)
            if filename.lower().endswith('.pdf'):
                try:
                    text_content = extract_text_from_pdf(file_obj)
                except Exception as e:
                    print("Error extracting PDF:", str(e))
                    return Response({"error": f"Error extracting PDF: {str(e)}"}, status=500)
            elif filename.lower().endswith('.docx'):
                try:
                    text_content = extract_text_from_docx(file_obj)
                except Exception as e:
                    print("Error extracting DOCX:", str(e))
                    return Response({"error": f"Error extracting DOCX: {str(e)}"}, status=500)
            elif filename.lower().endswith('.txt'):
                try:
                    file_obj.seek(0)
                    text_content = file_obj.read().decode('utf-8')
                except Exception as e:
                    print("Error reading TXT file:", str(e))
                    return Response({"error": f"Error reading TXT file: {str(e)}"}, status=500)
            else:
                print("Unsupported file type")
                return Response({"error": "Unsupported file type"}, status=400)
        elif url:
            filename = url
            print("URL provided:", url)
            try:
                text_content = extract_text_from_url(url)
            except Exception as e:
                print("Error extracting URL content:", str(e))
                return Response({"error": f"Error extracting URL content: {str(e)}"}, status=500)
        else:
            print("No file or URL provided")
            return Response({"error": "No file or URL provided"}, status=400)

        # --- Keyword Extraction using YAKE ---
        try:
            kw_extractor = yake.KeywordExtractor(lan="en", n=1, top=5)
            keywords_extracted = kw_extractor.extract_keywords(text_content)
            if keywords_extracted and isinstance(keywords_extracted[0], tuple):
                first, second = keywords_extracted[0]
                if isinstance(first, float) and isinstance(second, str):
                    keywords = [keyword for score, keyword in keywords_extracted]
                elif isinstance(first, str) and isinstance(second, float):
                    keywords = [keyword for keyword, score in keywords_extracted]
                else:
                    keywords = [str(item) for item in keywords_extracted]
            else:
                keywords = []
            print("Extracted keywords:", keywords)
        except Exception as e:
            print("Error extracting keywords:", str(e))
            keywords = [f"Keyword extraction error: {str(e)}"]

        # --- Generate Content Hash ---
        try:
            content_hash = hashlib.sha256(text_content.encode('utf-8')).hexdigest()
        except Exception as e:
            print("Error generating content hash:", str(e))
            return Response({"error": "Content processing failed"}, status=500)

        # --- Alternative Versioning Logic ---
        # Lookup all existing documents for this user that match the file name.
        existing_docs = Document.objects.filter(
            user=request.user,
            file_name=filename
        )
        
        if existing_docs.exists():
            # Determine the new version by taking the highest version and adding 1.
            new_version = existing_docs.order_by('-version').first().version + 1
            # Mark all existing documents for this file as non-current.
            existing_docs.update(is_current=False)
        else:
            new_version = 1

        # Create a new document record with the extracted data and proper version.
        new_doc = Document.objects.create(
            user=request.user,
            file_name=filename,
            content=text_content,
            keywords=keywords,
            content_hash=content_hash,
            version=new_version,
            is_current=True
        )
        print("Document created:", new_doc)
        response_data = {
            "id": new_doc.id,
            "content": new_doc.content,
            "keywords": new_doc.keywords,
            "version": new_doc.version
        }

        return Response(response_data)

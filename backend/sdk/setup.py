from setuptools import setup, find_packages

setup(
    name="distributed_logger",
    version="1.0.0",
    author="Prem Chandu Palivela",
    author_email="premchandupalivela32@gmail.com",
    description="A secure and async-ready distributed logging SDK for FastAPI backends",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/distributed_logger",
    packages=find_packages(),
    install_requires=[
        "aiohttp>=3.8.1",
        "websockets>=10.4",
    ],
    python_requires=">=3.9",
)

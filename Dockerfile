# Build the UI
FROM node:16.14 as ui
WORKDIR /app
COPY ./ui .
RUN npm install
RUN npm run build


# Use RENCI python base image
FROM renciorg/renci-python-image:v0.0.1

# Add image info
LABEL org.opencontainers.image.source https://github.com/TranslatorSRI/QueryLogger

# set up requirements
WORKDIR /app

# make sure all is writeable for the nru USER later on
RUN chmod -R 777 .

# Install requirements
ADD requirements-lock.txt .
RUN pip install -r requirements-lock.txt

# switch to the non-root user (nru). defined in the base image
USER nru

# Copy in files
COPY . .
# Copy compiled ui
COPY --from=ui /app/build ./ui/build

# Set up base for command and any variables
# that shouldn't be modified
ENTRYPOINT ["gunicorn", "server:APP", "-k", "uvicorn.workers.UvicornWorker", "--timeout", "0"]

# Variables that can be overriden
CMD [ "--bind", "0.0.0.0:9734", "--workers", "1"]

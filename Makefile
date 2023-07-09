IMAGE_NAME=mongo_server
IMAGE_PORT=27017

run:
	docker run --name $(IMAGE_NAME) -p $(IMAGE_PORT):$(IMAGE_PORT) -d mongo

stop:
	docker stop $(IMAGE_NAME)

clean:
	docker rm -f $(IMAGE_NAME)

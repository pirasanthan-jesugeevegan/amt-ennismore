docker:
	docker build -t ennismore:latest -f Dockerfile .
run:	
	docker run ennismore:latest yarn cypress:run
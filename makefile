run: install line.js
	@echo "Running matrix file"
	@node matrix.js
	@convert image.ppm pic.png
	@echo "Image data file converted, check image"

check:
	@echo "Checking for node"
	@node -v
	@echo "Node exists, checking for npm"
	@npm -v
	@echo "Both node and npm exist"

clean:
	@rm *.ppm *.png
	@echo "Directory cleaned"

install: check
	@echo "Installing/updating npm packages"
	@npm install colors
	@clear
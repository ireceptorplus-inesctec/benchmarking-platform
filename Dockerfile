FROM node:14

WORKDIR /benchmarking_platform

# Copy dependency definitions
COPY . .

# Install dependecies
RUN npm i -g @angular/cli typescript
RUN npm install

# Get all the code needed to run the app

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "run", "dev"]

#CMD ["./infinite_loop.sh"]

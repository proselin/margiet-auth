# /bin/sh

# Generate a private key
echo "Generating a new private key..."
openssl genrsa -out ./private.key 4096

# Generate a public key from the private key
echo "Generating a new public key..."
openssl rsa -in private.key -pubout -outform PEM -out public.key
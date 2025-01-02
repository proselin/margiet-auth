# /bin/sh

# Generate a secret key
openssl rand -base64 518 > ./jwt-secret.key

# Generate Refresh token secret
openssl rand -base64 518 > ./refresh-token-secret.key

# Generate Confirmation token secret
openssl rand -base64 518 > ./confirmation-token-secret.key

# Generate reset-password token secret
openssl rand -base64 518 > ./reset-password-token-secret.key

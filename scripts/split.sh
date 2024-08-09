# #!/bin/bash

# # Define domain variables
# DRIPTRACE_MEDICAL="medical.driptrace.com"
# LLPMG="site.lomalindapsych.com"
# FSCLINICALS="site.fsclinicals.com"
# LOCAL_0="localhost:2999"
# LOCAL_1="localhost:4"

# # Check if NODE_ENV is set
# if [ -z "$NODE_ENV" ]; then
#     echo "NODE_ENV is not set. Defaulting to production mode."
#     NODE_ENV="production"
# fi

# # Set NEXT_PUBLIC_ROOT_DOMAIN based on NODE_ENV
# echo "node environment is currently $NODE_ENV";
# if [ "$NODE_ENV" = "development" ]; then
#     export NEXT_PUBLIC_ROOT_DOMAIN="$LOCAL"
# else
#     export NEXT_PUBLIC_ROOT_DOMAIN="$DRIPTRACE_MEDICAL"
# fi

# # Output the result
# echo "NODE_ENV is set to: $NODE_ENV"
# echo "NEXT_PUBLIC_ROOT_DOMAIN is set to: $NEXT_PUBLIC_ROOT_DOMAIN"

# # Output other available domains (for reference)
# echo "Other available domains:"
# echo "LLPMG: $LLPMG"
# echo "FSCLINICALS: $FSCLINICALS"

#!/bin/bash

# Define domain variables
DRIPTRACE_MEDICAL="medical.driptrace.com"
LLPMG="lomalindapsych.com"
FSCLINICALS="fsclinicals.com"

# Define local development ports
LOCAL_DRIPTRACE="localhost:2999"
LOCAL_LLPMG="localhost:4"
# LOCAL_LLPMG="a34e-2603-8001-4d40-7862-6166-6d8c-6ef5-4e57.ngrok-free.app"
# LOCAL_LLPMG="ff96-2603-8001-4d40-7862-61a9-e4a8-835d-b014.ngrok-free.app"
LOCAL_FSCLINICALS="localhost:65535"

# Check if NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV is not set. Defaulting to production mode."
    NODE_ENV="production"
fi

# Function to set domain based on DEV_DOMAIN
set_dev_domain() {
    case "$DEV_DOMAIN" in
        "medical") echo "$LOCAL_DRIPTRACE" ;;
        "llpmg") echo "$LOCAL_LLPMG" ;;
        "fsclinicals") echo "$LOCAL_FSCLINICALS" ;;
        *) echo "$LOCAL_DRIPTRACE" ;; # Default to DRIPTRACE if not specified
    esac
}

# Set NEXT_PUBLIC_ROOT_DOMAIN based on NODE_ENV and DEV_DOMAIN
if [ "$NODE_ENV" = "development" ]; then
    export NEXT_PUBLIC_ROOT_DOMAIN=$(set_dev_domain)
else
    export NEXT_PUBLIC_ROOT_DOMAIN="$DRIPTRACE_MEDICAL"
fi

# Output the result
echo "NODE_ENV is set to: $NODE_ENV"
echo "NEXT_PUBLIC_ROOT_DOMAIN is set to: $NEXT_PUBLIC_ROOT_DOMAIN"

# Output all available domains and local ports (for reference)
echo "Available production domains:"
echo "DRIPTRACE_MEDICAL: $DRIPTRACE_MEDICAL"
echo "LLPMG: $LLPMG"
echo "FSCLINICALS: $FSCLINICALS"
echo "Available local development ports:"
echo "LOCAL_DRIPTRACE: $LOCAL_DRIPTRACE"
echo "LOCAL_LLPMG: $LOCAL_LLPMG"
echo "LOCAL_FSCLINICALS: $LOCAL_FSCLINICALS"
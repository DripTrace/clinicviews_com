#!/bin/bash

# Define the domains and ports for each context
DRIPTRACE_PROD="medical.driptrace.com"
LLPMG_PROD="site.lomalindapsych.com"
FSCLINICALS_PROD="site.fsclinicals.com"
DRIPTRACE_DEV_PORT="65535"
LLPMG_DEV_PORT="2999"
FSCLINICALS_DEV_PORT="4"

# Function to determine the app context and port
determine_app_context() {
    local hostname=$1
    local port=$2
    
    case "$hostname" in
        "$DRIPTRACE_PROD")
            echo "driptrace_production 80"
        ;;
        "$LLPMG_PROD")
            echo "llpmg_production 80"
        ;;
        "$FSCLINICALS_PROD")
            echo "fsclinicals_production 80"
        ;;
        "localhost"|"127.0.0.1")
            case "$port" in
                "$DRIPTRACE_DEV_PORT")
                    echo "driptrace_development $DRIPTRACE_DEV_PORT"
                ;;
                "$LLPMG_DEV_PORT")
                    echo "llpmg_development $LLPMG_DEV_PORT"
                ;;
                "$FSCLINICALS_DEV_PORT")
                    echo "fsclinicals_development $FSCLINICALS_DEV_PORT"
                ;;
                *)
                    echo "unknown_development 3000"
                ;;
            esac
        ;;
        *)
            echo "unknown 3000"
        ;;
    esac
}

# Get the hostname and port
if [ -z "$HOSTNAME" ]; then
    HOSTNAME=$(hostname)
fi
PORT=$(echo $HOSTNAME | cut -d: -f2)
HOSTNAME=$(echo $HOSTNAME | cut -d: -f1)

# Determine and set the app context and port
read APP_CONTEXT APP_PORT <<< $(determine_app_context $HOSTNAME $PORT)
export NEXT_PUBLIC_APP_CONTEXT=$APP_CONTEXT

echo "NEXT_PUBLIC_APP_CONTEXT set to: $NEXT_PUBLIC_APP_CONTEXT"
echo "Port set to: $APP_PORT"
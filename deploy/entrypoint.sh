#!/bin/bash

if [ ! -f /.seed_complete ]; then
    # Run seed
    npm run seed
    # Create flag file to indicate that the seed process has been completed
    touch /.seed_complete
fi

npm start

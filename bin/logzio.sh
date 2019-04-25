#!/bin/bash

curl -T buildlog.txt http://listener.logz.io:8021/file_upload/${LOGZIO_API_KEY}/${APPLICATION_NAME}

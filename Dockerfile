FROM alpine AS build

RUN apk add --no-cache zip

# actual building process
COPY . /data
WORKDIR /data
RUN ./build.sh

# the remaining code is used in github.com/svlentink/www
ARG WEBPATH=lent.ink/projects/pwd
ARG OUTPATH=/data/webroot/$WEBPATH
RUN mkdir -p `dirname $OUTPATH`

# Now we move the static website
# to the path we would visit in the browser
# this container thus specifies the path
RUN mv public $OUTPATH

FROM scratch
COPY --from=build /data /data

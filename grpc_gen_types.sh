#!/bin/bash

# to be able to restore proto/ and not lose work it has to be clean
if git status -s | grep '^ ..proto/' > /dev/null; then
	echo "the proto dir must be staged or clean to generate types. 'git add' or 'git restore' the dir"
	exit 1
fi

# start clean
rm -rf _tmp_grpc_types src/grpc/types

# i dont know why but this makes it work
sed -Ei '/^ +\/\/.*/d' proto/*.proto

# generate types to tmp dir
npx proto-loader-gen-types \
	--keepCase \
	--longs=String \
	--enums=String \
	--defaults \
	--oneofs \
	--grpcLib=@grpc/grpc-js \
	--outDir=_tmp_grpc_types \
	proto/*.proto

# undo `sed` on the proto dir
git restore proto

# convert ts files to d.ts to not fill dist with empty useless files
npx tsc -p tsconfig.grpc_types.json

# clean up
rm -r _tmp_grpc_types

# to get relative output from ls
cd src/grpc/types

# array of names of the d.ts files without their extension
protos=$(ls *.d.ts | sed 's/\.d\.ts//')

# to not use ../<file> all the time
cd .. # src/grpc

# header of generated file, notice one redirect symbol (>), this creates a fresh file with this content
echo -e "// Generated file. Do not edit. Edit the template proto.ts.template instead.\n" > proto.ts

# loop through lines of the template file and echo lines to the generated file. >> is used here to append it
cat proto.ts.template | while read line
do
	if echo "$line" | grep -i '{{name}}' > /dev/null 2>&1; then
		# this line contains {{Name}} or {{name}}
		for p in $protos
		do
			echo "$line" | sed "s/{{name}}/$p/g;s/{{Name}}/${p^}/g"
		done
	else
		# just write, nothing special
		echo "$line"
	fi
done >> proto.ts

# run prettier on the just generated files
npx pretty-quick

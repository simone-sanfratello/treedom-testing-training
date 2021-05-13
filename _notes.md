  docker run \
    -itd --name testing-tree -p 5432:5432 \
    -e POSTGRES_DB=tree \
    -e POSTGRES_USER=pg \
    -e POSTGRES_PASSWORD=none \
    treedom/test

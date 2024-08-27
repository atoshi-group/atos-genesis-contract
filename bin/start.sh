function init(){
rm -rf node/node*/{geth,logs}
./geth init --datadir node/node1  genesis.json
./geth init --datadir node/node2  genesis.json
./geth init --datadir node/node3  genesis.json
./geth init --datadir node/node4  genesis.json
./geth init --datadir node/node5  genesis.json
}

function start_geth(){
nohup node/node1/geth1 --networkid 1167 --config node/node1/config.toml --datadir node/node1 --unlock 0xa4eCD346d065827d303E95934eD712E978693d97 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/1node.log 2>&1 &
sleep 2
nohup node/node2/geth2 --networkid 1167 --config node/node2/config.toml --datadir node/node2 --unlock 0x2af1516cba4b8abd55e98ed2aabf91d367f02734 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/2node.log 2>&1 &
sleep 2
nohup node/node3/geth3 --networkid 1167 --config node/node3/config.toml --datadir node/node3 --unlock 0x217d71773caf8916484800b959248dafc44a0629 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/3node.log 2>&1 &
sleep 2
nohup node/node4/geth4 --networkid 1167 --config node/node4/config.toml --datadir node/node4 --unlock 0x82f74b5adc6cc4acac54d80a2559317284fe2b87 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/4node.log 2>&1 &
sleep 10
nohup node/node5/geth5 --networkid 1167 --config node/node5/config.toml --datadir node/node5 --unlock 0x68786fe80f10449c6cf3acd97299facf15050721 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/5node.log 2>&1 &
}

function del_data(){

	rm -rf node/node*/{geth,logs}
	}
	


function stop_geth(){
	pkill -9 geth
	}
CMD=$1
case ${CMD} in
reset)
	stop_geth
	sleep 2
    del_data
	init
	start_geth
    ;;
stop)
	stop_geth
    ;;
start)
	start_geth
    ;;
restart)
	stop_geth
	sleep 2
	start_geth
    ;;
*)
    echo "Usage: start.sh | reset | stop | start | restart"
    ;;
esac

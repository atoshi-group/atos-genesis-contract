#path_geth=node
#chainid=1167
##bash version >= 4.0
#declare -A node_wallet

#node_wallet["node0"]="0xa4eCD346d065827d303E95934eD712E978693d97"
#node_wallet["node1"]="0x2af1516cba4b8abd55e98ed2aabf91d367f02734"
#node_wallet["node2"]="0x217d71773caf8916484800b959248dafc44a0629"
#node_wallet["node3"]="0x82f74b5adc6cc4acac54d80a2559317284fe2b87"
#node_wallet["node4"]="0x68786fe80f10449c6cf3acd97299facf15050721"

#function init(){
#rm -rf ${path_geth}/node*/{geth,logs}
#for((i=0; i<5;i++)); do
#./geth init --datadir ${path_geth}/node${i}  genesis.json
#done
#}

#function start_geth(){
#        for((i=0; i<5; i++)); do
#            nohup ${path_geth}/node${i}/geth${i} --networkid ${chainid} --config ${path_geth}/node${i}/config.toml --datadir ${path_geth}/node${i} --unlock ${node_wallet[node${i}]} --password ${path_geth}/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/node${i}.log 2>&1 &
#                sleep  2
#        done
#}

function init(){
rm -rf node/node*/{geth,logs}
./geth init --datadir node/node1  genesis.json
./geth init --datadir node/node2  genesis.json
./geth init --datadir node/node3  genesis.json
./geth init --datadir node/node4  genesis.json
./geth init --datadir node/node5  genesis.json
}

function replace(){
# 提取 enode 地址并组成数组
nodes=$(cat node/node*/logs/core.log | grep enode: | awk -F"=" '{print $5"="$6}' | uniq | paste -sd "," -)
echo $nodes
# 检测操作系统
OS=$(uname)

if [ "$OS" = "Darwin" ]; then
	# macOS
	echo "Detected macOS"
	# 替换 config.toml 中的 StaticNodes 数组
	sed -i ''  "s|^StaticNodes = \[.*\]|StaticNodes = [$nodes]|" node/node*/config.toml
	elif [ "$OS" = "Linux" ]; then
	# Linux
	echo "Detected Linux"
	# 替换 config.toml 中的 StaticNodes 数组
	sed -i  "s|^StaticNodes = \[.*\]|StaticNodes = [$nodes]|" node/node*/config.toml
else
	echo "Unsupported OS: $OS"
	exit 1
fi
}

function start_geth(){
	nohup node/node1/geth1 --networkid 1167 --config node/node1/config.toml --datadir node/node1 --unlock 0xa4eCD346d065827d303E95934eD712E978693d97 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/1node.log 2>&1 &
	nohup node/node2/geth2 --networkid 1167 --config node/node2/config.toml --datadir node/node2 --unlock 0x2af1516cba4b8abd55e98ed2aabf91d367f02734 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/2node.log 2>&1 &
	nohup node/node3/geth3 --networkid 1167 --config node/node3/config.toml --datadir node/node3 --unlock 0x217d71773caf8916484800b959248dafc44a0629 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/3node.log 2>&1 &
	nohup node/node4/geth4 --networkid 1167 --config node/node4/config.toml --datadir node/node4 --unlock 0x82f74b5adc6cc4acac54d80a2559317284fe2b87 --password node/password.txt --mine --allow-insecure-unlock --cache 8000 --verbosity 5 --gcmode=full --nodiscover >logs/4node.log 2>&1 &
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
sleep 5
replace
stop_geth
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

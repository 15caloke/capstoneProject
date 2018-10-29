#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Build the Dingo network"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${CHANNEL_NAME:="mychannel"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
: ${VERBOSE:="false"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5

#CC_SRC_PATH="github.com/chaincode/chaincode_example02/go/"
#CC_SRC_PATH="github.com/chaincode/dingo/go/src/fab_dingo"
CC_SRC_PATH="github.com/chaincode/dingo/go/src/fab-dingo"
if [ "$LANGUAGE" = "node" ]; then
	CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/chaincode_example02/node/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
	PEER=$1
  	ORG=$2
	setGlobals $PEER $ORG
		set -x
	peer channel create -o orderer.dingo.com:7050 -c dingochannel${ORG} -f ./channel-artifacts/dingochannel${ORG}.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt		
	res=$?
		set +x
	
	cat log.txt
	#verifyResult $res "Channel creation failed"
	echo "===================== dingochannel1 created ===================== "
	echo
}

joinChannel () {
	for org in 1 2; do
	    for peer in 0 1; do
		joinChannelWithRetry $peer $org
		echo "================ peer${peer}.client${org} joined channel 'dingochannel${org}' ================ "
		sleep $DELAY
		echo
	    done
	done
}

## Create channel
echo "Creating channels..."
createChannel 0 1
createChannel 0 2

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for client1..."
updateAnchorPeers
#echo "Updating anchor peers for client2..."
#updateAnchorPeers 0 2


## Install chaincode on peer0.client1 and peer0.client2
"Installing chaincode on peer0.client1..."
installChaincode 0 1
echo "Install chaincode on peer0.client2..."
installChaincode 0 2

## Install chaincode on peer1.client2
echo "Installing chaincode on peer1.client1..."
installChaincode 1 1
echo "Installing chaincode on peer1.client2..."
installChaincode 1 2

# Instantiate chaincode on peer0.client2
echo "Instantiating chaincode on peer0.client2..."
instantiateChaincode 0 1
echo "Instantiating chaincode on peer0.client1..."
instantiateChaincode 0 2

# Query chaincode on peer0.client1
echo "Querying chaincode on peer0.client1..."
#chaincodeQuery 0 1 100

# Invoke chaincode on peer0.client1 and peer0.client2
#echo "Sending invoke transaction on peer0.client1 peer0.client2..."
#chaincodeInvoke 0 1 0 2

# Query on chaincode on peer1.client2, check if the result is 90
#echo "Querying chaincode on peer1.client2..."
#chaincodeQuery 1 2 90

echo
echo "========= All GOOD, DINGOFABRIC execution completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0

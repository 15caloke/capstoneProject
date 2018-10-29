// Created by Calum Oke with input from Unhandled Exceptions
// Last Updated on the 26th October 2018 by Calum Oke
//
// package fab_dingo utilises the fabric-shim API release 1.2 to provide
// Smart contracting to Dingo's Asset Provenance for authenticity and
// data integrity
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

// Define Asset object and fields
type Asset struct {
	SerialNumber           string `json:"SerialNumber"`
	OperatingEnvironmentID int    `json:"OperatingEnvironmentID"`
	LocationID             int    `json:"LocationID"`
	AssetModelID           int    `json:"AssetModelID"`
	AssetID                int    `json:"AssetID"`
	Asset                  string `json:"Asset"`
	DateInService          string `json:"DateInService"`
}

// For future use or decision changes
//type AssetsFab struct {
//	Key    string `json:"Key"`    // e.g. ASSET1
//	Record *Asset `json:"Record"` // Asset Object
//}

// Define Component object and fields
type Component struct {
	SerialNumber       string `json:"SerialNumber"`
	DefaultLabFormatID int    `json:"DefaultLabFormatID"`
	ComponentName      string `json:"ComponentName"`
	ComponentModelID   int    `json:"ComponentModelID"`
	ComponentID        int    `json:"ComponentID"`
	Component          string `json:"Component"`
	AssetID            int    `json:"AssetID"` // Relates to AssetID in Asset
}

// For future use or decision changes
//type ComponentsFab struct {
//	Key    string     `json:"Key"`    // e.g. COMP1
//	Record *Component `json:"Record"` // component object
//}

// Define Observation object and fields
type Observation struct {
	UpdateUserID           int    `json:"UpdateUserID"`
	SiteID                 int    `json:"SiteID"`
	MeterEventID           int    `json:"MeterEventID"`
	DataSourceID           int    `json:"DataSourceID"`
	TrakkaExceptionLevelID int    `json:"TrakkaExceptionLevelID"`
	ObservationExceptionID int    `json:"ObservationExceptionID"`
	ImportID               int    `json:"ImportID"`
	ObservationCode        string `json:"ObservationCode"`
	MeterReading           int    `json:"MeterReading"`
	ConnectionCodeID       int    `json:"ConnectionCodeID"`
	ObservationTypeID      int    `json:"ObservationTypeID"`
	ObservationID          int    `json:"ObservationID"`
}

// For future use or decision changes
//type ObservationFab struct {
//	Key    string       `json:"Key"`    // e.g. OBS1
//	Record *Observation `json:"Record"` // Observation object
//}

// Define Hash object and fields
type Hash struct {
	ReadyHashID int    `json:"ReadyHashID"`
	AssetID     int    `json:"AssetID"`
	Hash        string `json:"Hash"`
}

// Define Hash object from the ledger and its fields
type HashFab struct {
	Key    string `json:"Key"`
	Record *Hash
}

// Define the collection of all objects
type (
	Assets []Asset
	Components []Component
	Observations []Observation
	Hashes []Hash
)

// Define the Smart Contract for API
type SmartContract struct{}

// Define URL links to extract data from
const (
	ASSET_URL        = "http://206.189.24.238/assets"
	COMPONENTS_URL   = "http://206.189.24.238/components"
	OBSERVATIONS_URL = "http://206.189.24.238/observations"
	HASHES_URL       = "http://206.189.24.238/hashes"
	POST_HASHES_URL  = "http://fab-priv-srv.glitch.me/hashes"
)

// The Init method is called when the Smart Contract "fab-dingo" is instantiated by the blockchain network
// Best practice is to have any Ledger initialization in separate function -- see initLedger()
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success([]byte("=== Initiated Smart Contract ==="))
}

// The Invoke method is called as a result of an application request to run the Smart Contract "fab-dingo"
// The calling application program has also specified the particular smart contract function to be called, with arguments
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryObj" {
		return s.queryObj(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "updateDateInService" {
		return s.updateDateInService(APIstub, args)
	} else if function == "changeComponent" {
		return s.changeComponent(APIstub, args)
	} else if function == "changeComponentToDiffAsset" {
		return s.changeComponentToDiffAsset(APIstub, args)
	} else if function == "queryAllAssets" {
		return s.queryAllAssets(APIstub)
	} else if function == "queryAllComps" {
		return s.queryAllComps(APIstub)
	} else if function == "queryAllObs" {
		return s.queryAllObs(APIstub)
	} else if function == "exportData" {
		return s.exportData(APIstub)
	} else if function == "queryAllHashes" {
		return s.queryAllHashes(APIstub)
	} else {
		return shim.Error("Invalid Smart Contract function name.")
	}
}

// Initiates the ledger with all retrieved Assets, Components, Observations and Hashes
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	assets := getLinkAssets()
	components := getLinkComponents()
	observations := getLinkObservations()
	hashes := getLinkHashes()

	i := 0
	for i < len(assets) {
		fmt.Println("i is ", i)
		assetsBytes, _ := json.Marshal(assets[i])
		APIstub.PutState("ASSET"+strconv.Itoa(i), assetsBytes)
		fmt.Println("Added", assets[i])
		i = i + 1
	}

	j := 0
	for j < len(components) {
		fmt.Println("j is ", j)
		componentsBytes, _ := json.Marshal(components[j])
		APIstub.PutState("COMP"+strconv.Itoa(j), componentsBytes)
		fmt.Println("Added", components[j])
		j = j + 1
	}

	k := 0
	for k < len(observations) {
		fmt.Println("k is ", k)
		obsAsBytes, _ := json.Marshal(observations[k])
		APIstub.PutState("OBS"+strconv.Itoa(k), obsAsBytes)
		fmt.Println("Added", observations[k])
		k = k + 1
	}

	l := 0
	for l < len(hashes) {
		fmt.Println("l is ", l)
		hashBytes, _ := json.Marshal(hashes[l])
		APIstub.PutState("HASH"+strconv.Itoa(l), hashBytes)
		fmt.Println("Added", hashes[l])
		l = l + 1
	}

	fmt.Printf("initLedger Successful")
	return shim.Success([]byte("=== Initialisation of Ledger Complete ==="))
}

// Updates an Asset's "DateInService" field with the argument given
// Should be used when an Asset has been serviced and needs to be updated
func (s *SmartContract) updateDateInService(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	assetsBytes, _ := APIstub.GetState(args[0])
	asset := Asset{}

	json.Unmarshal(assetsBytes, &asset)
	oldDate := asset.DateInService
	asset.DateInService = args[1]

	assetsBytes, _ = json.Marshal(asset)
	APIstub.PutState(args[0], assetsBytes)

	return shim.Success([]byte("Last Date: " + oldDate + "\nNew Date: " + args[1]))
}

// Updates the Component's component product with the argmuent provided
// To be used when a new component is put into the Asset (swapped out)
func (s *SmartContract) changeComponent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	assetsBytes, _ := APIstub.GetState(args[0])
	component := Component{}

	json.Unmarshal(assetsBytes, &component)
	oldComp := component.Component
	component.Component = args[1]

	assetsBytes, _ = json.Marshal(component)
	APIstub.PutState(args[0], assetsBytes)

	return shim.Success([]byte("Old Component: " + oldComp + "\nNew Component: " + args[1]))
}

// Updates the Component's component product to another already existing Asset
func (s *SmartContract) changeComponentToDiffAsset(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	assetsBytes, _ := APIstub.GetState(args[0]) // componentID
	component := Component{}
	json.Unmarshal(assetsBytes, &component)
	newAssetID := args[1]
	parsedAssetID, err := strconv.Atoi(newAssetID) // Try parse into an int

	if err != nil {
		fmt.Println(err)
	}

	component.AssetID = parsedAssetID
	assetsBytes, _ = json.Marshal(component)
	APIstub.PutState(args[0], assetsBytes)

	return shim.Success(nil)
}

// Gets the single [Asset, Component, Observation, Hash] with the inputted argument and returns
// it in a single JSON object
//
// If no object can be found, it will return an error with the following message
func (s *SmartContract) queryObj(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	assetBytes, _ := APIstub.GetState(args[0])

	if assetBytes == nil {
		return shim.Error("That Object Does not Exist")
	}

	fmt.Printf("Query Successful")
	return shim.Success(assetBytes)
}

// Retrieves all Assets from in their current state and displays them to the console in
// JSON format
//
// If no Assets can be found at all, then an error will be thrown and prompted with a message
func (s *SmartContract) queryAllAssets(APIstub shim.ChaincodeStubInterface) sc.Response {
	assetsBytes := queryObjs(APIstub, "ASSET0", "ASSET999")

	if assetsBytes == nil {
		return shim.Error("No Assets exist in state, maybe try initiate the ledger?")
	}

	return shim.Success(assetsBytes)
}

// Gets all Components provided by the private Server endpoint from Components prior and
// displays them to the console in JSON format
//
// If no Components can be found at all, then an error will be thrown and prompted with a message
func (s *SmartContract) queryAllComps(APIstub shim.ChaincodeStubInterface) sc.Response {
	compBytes := queryObjs(APIstub, "COMP0", "COMP999")

	if compBytes == nil {
		return shim.Error("No Components exist in state, maybe try initiate the ledger?")
	}

	return shim.Success(compBytes)
}

// Gets all Observations provided by the private Server endpoint from Observations prior and
// displays them to the console in JSON format
//
// If no Observations can be found at all, then an error will be thrown and prompted with a message
func (s *SmartContract) queryAllObs(APIstub shim.ChaincodeStubInterface) sc.Response {
	obsBytes := queryObjs(APIstub, "OBS0", "OBS999")

	if obsBytes == nil {
		return shim.Error("No Observations exist in state, maybe try initiate the ledger?")
	}

	return shim.Success(obsBytes)
}

// Gets all hashes provided by the private Server endpoint from Assets prior and
// displays them to the console in JSON format
//
// If no Hashes can be found at all, then an error will be thrown and prompted with a message
func (s *SmartContract) queryAllHashes(APIstub shim.ChaincodeStubInterface) sc.Response {
	hashBytes := queryObjs(APIstub, "HASH0", "HASH999")

	if hashBytes == nil {
		return shim.Error("No Hashes exist in state, maybe try initiate the ledger?")
	}

	return shim.Success(hashBytes)
}

// Retrieves all JSON objects that are in the key range from the first argument to the second
// (inclusive) and returns a new JSON object with the Key field and a Record field of the objects
func queryObjs(APIstub shim.ChaincodeStubInterface, startKey string, endKey string) []byte {
	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)

	if err != nil {
		fmt.Println(err)
	}

	defer resultsIterator.Close()
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			fmt.Println(err)
		}

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")
		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}

	buffer.WriteString("]")

	return buffer.Bytes()
}

// Retrieves all the 'ReadyHashes' as JSON objects from the private Fabric Server API endpoint
// and returns an array of all Hashes
func getLinkHashes() Hashes {
	res, err := http.Get(HASHES_URL)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(res.Body)
	jsonResponses, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(jsonResponses, "\n")
	res.Body.Close()
	fmt.Printf("JSON:\r\n%s\r\n", jsonResponses)
	hashJson := Hashes{}
	err1 := json.Unmarshal([]byte(jsonResponses), &hashJson)

	if err1 != nil {
		fmt.Println(err1)
	}

	return hashJson
}

// Retrieves all the Assets as JSON objects from the private Fabric Server API endpoint
// and returns an array of all Assets
func getLinkAssets() []Asset {
	res, err := http.Get(ASSET_URL)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(res.Body)
	jsonResponses, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(jsonResponses, "\n")
	res.Body.Close()
	fmt.Printf("JSON:\r\n%s\r\n", jsonResponses)

	assetsJson := Assets{}
	err1 := json.Unmarshal([]byte(jsonResponses), &assetsJson)

	if err1 != nil {
		fmt.Println(err1)
	}

	return assetsJson
}

// Retrieves all the Components as JSON objects from the private Fabric Server API endpoint
// and returns an array of all Components
func getLinkComponents() []Component {
	res, err := http.Get(COMPONENTS_URL)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(res.Body)
	jsonResponses, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(jsonResponses, "\n")
	res.Body.Close()
	fmt.Printf("JSON:\r\n%s\r\n", jsonResponses)
	components := Components{}
	err1 := json.Unmarshal([]byte(jsonResponses), &components)

	if err1 != nil {
		fmt.Println(err1)
	}

	return components
}

// Retrieves all the Observations as JSON objects from the private Fabric Server API endpoint
// and returns an array of all Observations
func getLinkObservations() []Observation {
	res, err := http.Get(OBSERVATIONS_URL)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(res.Body)
	jsonResponses, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	fmt.Println(jsonResponses, "\n")
	res.Body.Close()
	fmt.Printf("JSON:\r\n%s\r\n", jsonResponses)
	obsJson := Observations{}
	err1 := json.Unmarshal([]byte(jsonResponses), &obsJson)

	if err1 != nil {
		fmt.Println(err1)
	}

	return obsJson
}

// POSTs data to the private Fabric Server for the client side to pull from and complete the hash comparison
// Currently only posts hashes in fabric structure
func (s *SmartContract) exportData(APIstub shim.ChaincodeStubInterface) sc.Response {

	hashesBytes := queryObjs(APIstub, "HASH0", "HASH999")

	allHashes := []HashFab{}
	json.Unmarshal(hashesBytes, &allHashes)

	fmt.Println("All Hashes: ", allHashes)

	// POST each hash object to the private Fabric Server
	for i, val := range allHashes {
		b := new(bytes.Buffer)
		json.NewEncoder(b).Encode(val)
		res, _ := http.Post(POST_HASHES_URL, "application/json", b)
		io.Copy(os.Stdout, res.Body)
		fmt.Println("Done HASH", i, "Value:", val)
	}

	fmt.Println("posted all data successfully")
	return shim.Success([]byte("Data exported successfully, check " + POST_HASHES_URL))
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

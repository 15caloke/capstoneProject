// Created By Calum Oke,
// Last Updated 29/10/18 By Calum Oke
//
// The web application package is designed to emulate the REST API side that
// clients would navigate to the endpoints and perform some chaincode function
// that interact with the ledger
//
// Unfortunately due to time constraints, the web app only performs functions
// defined in this package. In any case, when a user sends a GET request to an endpoint,
// it would utilise the "peer chaincode query" command, otherwise any other modification
// of data would be ran under the "peer chaincode invoke" command
//
// To see chaincode posting to a server through the CLI container under the invokable function,
// "exportData," visit: http://fab-priv-srv.glitch.me/hashes
//
// This web application is hosted on DigitalOcean at:
// http://206.189.24.238
package web_app

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	//_ "github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	//_ "github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
	//_ "github.com/hyperledger/fabric-sdk-go/pkg/errors/retry"
	//_ "github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	//_ "github.com/hyperledger/fabric-sdk-go/pkg/logging/utils"
	//_ "github.com/hyperledger/fabric-sdk-go/test/integration"
	//_ "github.com/hyperledger/fabric/core/chaincode/shim"
	//_ "github.com/hyperledger/fabric/protos/peer"
	//_ "google.golang.org/genproto/googleapis/spanner/admin/instance/v1"
	"io/ioutil"
	//_ "log"
	"net/http"
	"strconv"
	//_ "testing"
)

// Defining Asset Model
type Asset struct {
	ID                     string `json:"_id"` // MongoDB property
	SerialNumber           string `json:"SerialNumber"`
	OperatingEnvironmentID int    `json:"OperatingEnvironmentID"`
	LocationID             int    `json:"LocationID"`
	AssetModelID           int    `json:"AssetModelID"`
	AssetID                int    `json:"AssetID"`
	Asset                  string `json:"Asset"`
	DateInService          string `json:"DateInService"`
	V                      int    `json:"__v"` // MongoDB property
}

// Defining Component Model
type Component struct {
	ID                 string `json:"_id"` // MongoDB property
	SerialNumber       string `json:"SerialNumber"`
	DefaultLabFormatID int    `json:"DefaultLabFormatID"`
	ComponentName      string `json:"ComponentName"`
	ComponentModelID   int    `json:"ComponentModelID"`
	ComponentID        int    `json:"ComponentID"`
	Component          string `json:"Component"`
	AssetID            int    `json:"AssetID"` // Relates to AssetID in Asset
	V                  int    `json:"__v"`     // MongoDB property
}

// Defining Observation Model
type Observation struct {
	ID                     string `json:"_id"` // MongoDB property
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
	V                      int    `json:"__v"` // MongoDB property
}

// Defining Hash Model
type Hash struct {
	ID          string `json:"_id"` // MongoDB property
	ReadyHashID int    `json:"ReadyHashID"`
	AssetID     int    `json:"AssetID"`
	Hash        string `json:"Hash"`
	V           int    `json:"__v"` // MongoDB property
}

// Defining Collection of Objects
type (
	Assets []Asset
	Components []Component
	Observations []Observation
	Hashes []Hash
)

// URL endpoints and other constants
const (
	ASSET_URL        = "http://mock-trakka.glitch.me/assets"
	COMPONENTS_URL   = "http://mock-trakka.glitch.me/components"
	OBSERVATIONS_URL = "http://mock-trakka.glitch.me/observations"
	HASHES_URL       = "http://cust-db.glitch.me/readyhashes"
	PORT             = ":8082"
)

// ------------------------------------ HELPER FUNCTIONS -----------------------------------------------------------------

// Retrieves all Asset objects from the external API endpoint
func getLinkAssets() []Asset {
	res, err := http.Get(ASSET_URL)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	json_response, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}

	res.Body.Close()

	assetsJson := Assets{}
	err1 := json.Unmarshal([]byte(json_response), &assetsJson)
	if err1 != nil {
		fmt.Println(err1)
	}
	return assetsJson
}

// Retrieves all Component objects from the external API endpoint
func getLinkComponents() []Component {
	res, err := http.Get(COMPONENTS_URL)
	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	json_response, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	res.Body.Close()
	compsJson := Components{}
	err1 := json.Unmarshal([]byte(json_response), &compsJson)
	if err1 != nil {
		fmt.Println(err1)
	}
	return compsJson
}

// Retrieves all Observations objects from the external API endpoint
func getLinkObservations() []Observation {
	res, err := http.Get(OBSERVATIONS_URL)
	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	json_response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	res.Body.Close()

	obsJson := Observations{}
	err1 := json.Unmarshal([]byte(json_response), &obsJson)
	if err1 != nil {
		fmt.Println(err1)
	}
	return obsJson
}

// Retrieves all Hash objects from the external API endpoint
func getLinkHashes() []Hash {
	res, err := http.Get(HASHES_URL)
	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	json_response, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Printf("%s\r\n", err)
	}
	res.Body.Close()

	hashesJson := Hashes{}
	err1 := json.Unmarshal([]byte(json_response), &hashesJson)
	if err1 != nil {
		fmt.Println(err1)
	}
	return hashesJson
}

// ------------------- WEB APP FUNCTIONS -------------------------------------

// Prompt user with each REST endpoint URL
func indexPage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `
		Welcome to U.E. API Directory!
----------------------------------------------------------------------------

For all Assets go to:	        /assets
For singular Asset go:	        /assets/{AssetID}
For all Components go to:	    /components
For singular Component go:	    /components/{ComponentID}
For all Observations go to:	    /observations
For singular Observation go:	/observations/{ObservationID}
For all ReadyHashes go to:		/hashes
For singular Asset go:			/hashes/{HashID}
									
			Happy Coding!
`)
}

// Displays all Asset objects
func getAllAssets(w http.ResponseWriter, r *http.Request) {
	assets := getLinkAssets()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(assets)
}

// Displays single Asset object according to the inputted Asset ID
func getAsset(w http.ResponseWriter, r *http.Request) {
	assets := getLinkAssets()
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for _, item := range assets {
		if strconv.Itoa(item.AssetID) == params["AssetID"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode("Asset does not exists")
}

// Displays single Component object according to the inputted Component ID
func getComp(w http.ResponseWriter, r *http.Request) {
	comps := getLinkComponents()
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for _, item := range comps {
		if strconv.Itoa(item.ComponentID) == params["ComponentID"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode("Component does not exists")
}

// Displays all Component objects
func getAllComps(w http.ResponseWriter, r *http.Request) {
	comps := getLinkComponents()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comps)
}

// Displays all Observation objects
func getAllObs(w http.ResponseWriter, r *http.Request) {
	obs := getLinkObservations()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(obs)
}
// Displays single Observation object according to the inputted Observation ID
func getObs(w http.ResponseWriter, r *http.Request) {
	obs := getLinkObservations()
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for _, item := range obs {
		if strconv.Itoa(item.ObservationID) == params["ObservationID"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode("Observation does not exists")
}

// Displays all Hash objects
func getAllHashes(w http.ResponseWriter, r *http.Request) {
	hashes := getLinkHashes()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(hashes)
}

// Displays single Hash object according to the inputted Hash ID
func getHash(w http.ResponseWriter, r *http.Request) {
	hashes := getLinkHashes()
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	for _, item := range hashes {
		if strconv.Itoa(item.ReadyHashID) == params["ReadyHashID"] {
			json.NewEncoder(w).Encode(item)
			return
		}
	}
	json.NewEncoder(w).Encode("Hash does not exists")
}

// Creates new Asset object and updates the assets endpoint with new Asset object
// - This was tested to work via Postman request. No actual way for the client
// to post via UI
func postReadyData(w http.ResponseWriter, r *http.Request) {
	var asset Asset
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewDecoder(r.Body).Decode(&asset)
	json.NewEncoder(w).Encode(asset)
}

//// Creates Router and routes, host server on the port specified in the constants
//// VISIT web_app.go to run application
//func main() {
//	// Initialise the router
//	r := mux.NewRouter()
//
//	// Index page user is greeted with
//	r.HandleFunc("/", indexPage)
//
//	// Read API Endpoint Functions
//	r.HandleFunc("/assets", getAllAssets).Methods("GET")
//	r.HandleFunc("/assets/{AssetID}", getAsset).Methods("GET")
//	r.HandleFunc("/components", getAllComps).Methods("GET")
//	r.HandleFunc("/components/{ComponentID}", getComp).Methods("GET")
//	r.HandleFunc("/observations", getAllObs).Methods("GET")
//	r.HandleFunc("/observations/{ObservationID}", getObs).Methods("GET")
//	r.HandleFunc("/hashes", getAllHashes).Methods("GET")
//	r.HandleFunc("/hashes/{ReadyHashID}", getHash).Methods("GET")
//	r.HandleFunc("/assets", postReadyData).Methods("POST")
//
//	// Run server on port 80 (standard port) from cloud host and log any errors that occur to the console
//	log.Fatal(http.ListenAndServe(PORT, r))
//}

// Excess Code that was used to try create proper REST API
/*
// REST API References
//var Sdk *fabsdk.FabricSDK
//var Client1 *channel.Client
//var LedgerClient *ledger.Client

//Sdk.Config()
	//sdk.
	//cc.
	//queryCC(T,Client1, HASHES_URL)
	// If calling Query
	response, err := instance.Client1.Query(channel.Request{ChaincodeID: request.ChaincodeId, Fcn: request.Fn, Args: argsAsBytes})
	if err != nil {
		utils.Info("Failed to query cc: %s", err)
	}

	// If calling Invoke
	response, err := instance.Client1.Execute(channel.Request{ChaincodeID: request.ChaincodeId, Fcn: request.Fn, Args: argsAsBytes})
	if err != nil {
		utils.Info("Failed to invoke cc: %s\n", err)
	}

func queryCC(client *channel.Client, targetEndpoints ...string) []byte {
	response, err := client.Query(channel.Request{ChaincodeID: "dcc", Fcn: "invoke", Args: integration.ExampleCCQueryArgs()},
		channel.WithRetry(retry.DefaultOpts),
		channel.WithTargetEndpoints(targetEndpoints...),
	)
	if err != nil {
		log.Fatal("Failed to query funds: %s", err)
	}
	return response.Payload
}
 */

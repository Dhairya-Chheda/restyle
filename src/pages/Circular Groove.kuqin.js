import wixData from 'wix-data';
import { getLat } from "backend/postCode"
import { fetch } from 'wix-fetch';
var res;
var geolib = require('geolib');
import { getDistance } from 'geolib';
import wixWindow from 'wix-window';

$w.onReady(function () {
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];
    var item = [];
    var material = [];
    var needed = [];

    wixData.query("News")
        .limit(1000)
        .find()
        .then((res) => {
            let items = res.items;

            if (res.items.length > 0) {
                for (var i = 0; i < res.items.length; i++) {

                    //arr.push(`{label: ${res.items[0].projectName}, value: ${res.items[0].projectName}}`);
                    temp1 = temp1.concat(res.items[i].clothingItems);
                    temp2 = temp2.concat(res.items[i].materials);
                    temp3 = temp3.concat(res.items[i].jobType);

                    // temp2.push(res.items[i].state);
                    // temp3.push(res.items[i].month);

                }
                // temp1.unshift('All Clothing Item');
                // temp2.unshift('All Materials');
                // temp3.unshift('All Options');
                console.log('Months');

                let uniqueChars1 = [...new Set(temp1)];
                let uniqueChars2 = [...new Set(temp2)];
                let uniqueChars3 = [...new Set(temp3)];
                for (var i = 0; i < uniqueChars1.length; i++) {
                    item.push({ 'label': uniqueChars1[i], 'value': uniqueChars1[i] }, );

                }
                for (var i = 0; i < uniqueChars2.length; i++) {
                    material.push({ 'label': uniqueChars2[i], 'value': uniqueChars2[i] }, );

                }
                for (var i = 0; i < uniqueChars3.length; i++) {
                    needed.push({ 'label': uniqueChars3[i], 'value': uniqueChars3[i] }, );

                }
                // console.log(ls);
                // console.log(state);
            }
            $w('#dropdownItem').options = item;
            $w('#dropdownMaterial').options = material;
            $w('#dropdownNeeded').options = needed;
        })

    $w("#repeater1").forEachItem(($item, itemData, index) => {

    });
    $w('#btnSearch').onClick(() => {

        var webhook = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $w('#iptPostalCode').value + '&key=AIzaSyDpjKAG6ymRHxdSIM-aXPXeAF9N7yKIHbs&region=UK';

        fetch(webhook)
            .then(response => response.json())
            .then(data => {
                console.log("data", data);
                res = data;
            })
        // res = zipcodes.lookup("SW1W 8DA");
        // console.log(zipcodes.lookup("SW1W 8DA"),"res");
        var newfilter = wixData.filter();
        if(wixWindow.formFactor !== "Mobile"){
            console.log("IN THE DESKTOP IF LOOP"); //SHOULD NOT CONSOLE IN MOBILE
            if ($w('#dropdownItem').value != '' && $w('#dropdownItem').value != "All clothing Item") {
                var dropdownCloths = [];
                dropdownCloths.push($w('#dropdownItem').value);
                newfilter = newfilter.hasSome('clothingItems', dropdownCloths); 
            }
            if ($w('#dropdownMaterial').value != '' && $w('#dropdownMaterial').value != "All materials") {
                var dropdownMaterial = [];
                dropdownMaterial.push($w('#dropdownMaterial').value);
                newfilter = newfilter.hasSome('materials', dropdownMaterial)
            }
            if ($w('#dropdownNeeded').value != '' && $w('#dropdownNeeded').value != "All Options") {
                var dropdownOptions = [];
                dropdownOptions.push($w('#dropdownNeeded').value);
                newfilter = newfilter.hasSome('jobType', dropdownOptions)
            }
        }
        ///////////////////////
        if(wixWindow.formFactor === "Mobile"){
            console.log($w('#selectionTagsItem').value);
            console.log($w('#selectionTagsMaterial').value);
            console.log($w('#selectionTagsJobType').value);
            if ($w('#selectionTagsItem').value.length !== 0) {
                newfilter = newfilter.hasSome('clothingItems', $w('#selectionTagsItem').value); 
            }
            if ($w('#selectionTagsMaterial').value.length !== 0) {
                console.log("IN THE TAGS MATERIAL");
                console.log($w('#selectionTagsMaterial').value);
                newfilter = newfilter.hasSome('materials', $w('#selectionTagsMaterial').value); 
            }
            if ($w('#selectionTagsJobType').value.length !== 0) {
                newfilter = newfilter.hasSome('jobType', $w('#selectionTagsJobType').value); 
            }
        }
        
        // const { itemsId } = await nearMe({jobType: $w("#selectionTagsItem").value}, "postalId", 0 )
        // $w("#newsDataset").setFilter(wixData.filter().eq("_id", itemsId));

        $w("#newsDataset").setFilter(newfilter)
            .then(() => {
                console.log("newfilter", newfilter);
                $w("#repeater1").forEachItem(($item, itemData, index) => {
                    if (res.status === "OK") {
                        var check = geolib.isPointWithinRadius({ latitude: itemData.address.location.latitude, longitude: itemData.address.location.longitude }, { latitude: res.results[0].geometry.location.lat, longitude: res.results[0].geometry.location.lng },
                            25000
                        );
                        var distance = getDistance({ latitude: itemData.address.location.latitude, longitude: itemData.address.location.longitude }, { latitude: res.results[0].geometry.location.lat, longitude: res.results[0].geometry.location.lng });
                        console.log("distance", distance);
                        if (check === false) {
                            $item('#container3').collapse();

                        }
                        itemData.miles = distance;
                        $item("#miles").text = `${(distance/1609).toFixed(2)} Miles`
                        $item("#miles").show();
                        $item("#text329").show();
                        $item("#miles").expand();
                        $item("#text329").expand();
                        sorting();
                    } else {
                        console.log("test");
                        $item("#miles").hide();
                        $item("#text329").hide();
                        $item("#miles").collapse();
                        $item("#text329").collapse();
                    }

                });
            });
        let toInsert = {
            "clothingItem": $w('#selectionTagsItem').value,
            "material": $w('#selectionTagsMaterial').value,
            "service": $w('#selectionTagsJobType').value,
            "postCode": $w('#iptPostalCode').value
        };

        wixData.insert("Logs", toInsert)
            .then((item) => {
                console.log(item); //see item below
            })
            .catch((err) => {
                console.log(err);
            });
    })

});

function sorting() {
    var datas = $w('#repeater1').data
    console.log(datas);
    datas.sort((a, b) => {
        return a.miles - b.miles;
    });
    $w('#repeater1').data = datas;
}

$w.onReady(function () {
    $w('#newsDataset').onReady(() => {
        $w('#repeater1').onItemReady(($item, itemData) => {
            let sTitle = itemData.deliveryMessaging;
            if (sTitle === "" || sTitle === null || sTitle === undefined) {
                $item("#badge").hide();
            } else {
                $item("#badge").show();
                $item("#badge").expand();
            }
        })
    })

});

export function btnSearch_click(event) {
    $w("#resultsMessaging").show();
    $w("#resultsMessaging").expand();
}






export function viewGuidePricesButton_click(event) {
    // $w('#box75').show();
    // $w('#box75').expand();
    $w('#hideGuidePricesButton').show();
    $w('#hideGuidePricesButton').expand();
    $w('#viewGuidePricesButton').hide();
    $w('#viewGuidePricesButton').collapse();

    let $item = $w.at(event.context);

    if($item("#viewGuidePricesButton").text === "+ Show guide prices for Maz Tailoring"){
        $w('#box75').show();
        $w('#box75').expand();
    }

    if ($item("#viewGuidePricesButton").text === "THE WARDROBE CURATOR"){
        $w('#box75').show();
        $w('#box75').expand();
    }    
    
    // if ($item("#text141").text === "Education and work experience"){
    //     $w("#InterviewModule0103").expand();
    // }                
    
    else { 
        $w('#box75').show();
        $w("#box75").expand();
        
    }
// console.log($item("#text141").text)

}


export function hideGuidePricesButton_click(event) {
    $w('#box75').hide();
    $w('#box75').collapse();
    $w('#viewGuidePricesButton').show();
    $w('#viewGuidePricesButton').expand();
    $w('#hideGuidePricesButton').hide();
    $w('#hideGuidePricesButton').collapse();
}



// import {session as storage} from 'wix-storage';

// $w.onReady(async function () {
// 	$w('#setItemButton').onClick( () => {
// 		storage.setItem($w('#setKey').value, $w('#setValue').value);
//         $w('#setKey').value = undefined;
//         $w('#setValue').value = undefined;
// 	});

// 	$w('#getItemButton').onClick( () => {
// 		$w('#getValue').value = storage.getItem($w('#getKey').value);
//         $w('#getKey').value = undefined;
// 	});

// 	$w('#removeItemButton').onClick( () => {
// 		storage.removeItem($w('#removeKey').value);
//         $w('#removeKey').value = undefined;
// 	});
	
// 	$w('#clearButton').onClick( () => {
// 		storage.clear();
// 	});
// });



/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/


$w.onReady(function () {
    $w('#newsDataset').onReady(() => {
        $w('#repeater1').onItemReady(($item, itemData) => {
            let sTitle = itemData.signedUp;
            if (sTitle === true) {
                $item("#requestquoteCTA").hide();
                $item("#requestquoteCTA").collapse();
                $item("#booknowCTA").show();
                $item("#booknowCTA").expand();
            } else {
                $item("#requestquoteCTA").show();
                $item("#requestquoteCTA").expand();
                $item("#booknowCTA").hide();
                $item("#booknowCTA").collapse();
            }
        })
    })

});
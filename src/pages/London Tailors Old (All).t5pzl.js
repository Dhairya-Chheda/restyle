import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { getOpts } from "backend/getOpts";
import { getTailorNearMe } from "backend/nearme";

let itemPerPage = 100; // 10 for mobile 100 for desktop
let currPage = 0;

$w.onReady(function () {
    getOpts().then(({ item, material, needed }) => {
        $w('#dropdownItem').options = item;
        $w('#dropdownMaterial').options = material;
        $w('#dropdownNeeded').options = needed;
    });

    $w('#btnSearch').onClick(() => {
        search();
        let toInsert = {
            clothingItem: $w('#selectionTagsItem').value,
            material: $w('#selectionTagsMaterial').value,
            service: $w('#selectionTagsJobType').value,
            postCode: $w('#iptPostalCode').value
        };

        wixData.insert("Logs", toInsert)
            .then(console.log)
            .catch(console.log);
    })

});

async function search(page = currPage) {
    let postalId = $w("#iptPostalCode").value;
    let filterOpts;

    if (wixWindow.formFactor === "Mobile") {
        itemPerPage = 10;
        filterOpts = {
            clothingItems: $w("#selectionTagsItem").value,
            materials: $w("#selectionTagsMaterial").value,
            jobType: $w("#selectionTagsJobType").value
        }
    } else {
        itemPerPage = 100
        filterOpts = {
            clothingItems: $w("#dropdownItem").value,
            materials: $w("#dropdownMaterial").value,
            jobType: $w("#dropdownNeeded").value
        }
    }

    const { items, itemMapMiles, hasError } = await getTailorNearMe(filterOpts, postalId);

    const firstSlice = items.splice(0, page * itemPerPage);

    await $w("#newsDataset").setPageSize(itemPerPage)
    await $w("#newsDataset").setFilter(wixData.filter().eq("_id", firstSlice.map(itemData => itemData._id)))

    $w("#repeater1").forEachItem(($item, itemData, index) => {
        if (!hasError) {
            itemData.miles = itemMapMiles[itemData._ID];
            $item("#miles").text = `${itemData.miles.toFixed(2)} Miles`;
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

}

function sorting() {
    var datas = $w('#repeater1').data
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

    if ($item("#viewGuidePricesButton").text === "+ Show guide prices for Maz Tailoring") {
        $w('#box75').show();
        $w('#box75').expand();
    }

    if ($item("#viewGuidePricesButton").text === "THE WARDROBE CURATOR") {
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

// $w.onReady(function () {
//     $w('#newsDataset').onReady(() => {
//         $w('#repeater1').onItemReady(() => {
//         let tailor = $w("#newsDataset").getCurrentItem();

//         if (tailor.signedUp === true) {
//             $w("#booknowCTA").show();
//             $w("#booknowCTA").expand();
//             $w("#requestquoteCTA").hide();
//             $w("#requestquoteCTA").collapse();

//         } else {
//             $w("#booknowCTA").hide();
//             $w("#booknowCTA").collapse();
//             $w("#requestquoteCTA").show();
//             $w("#requestquoteCTA").expand();
//         }
//         })
//     })

// });

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
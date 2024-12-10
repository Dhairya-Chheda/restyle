import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { getOpts } from "backend/getOpts.jsw";
import { filterTailorWithMiles } from "backend/nearBy.jsw";
import { local } from "wix-storage-frontend";

let itemPerPage = 100; // 10 for mobile 100 for desktop
let currPage = 1;

const isMobile = wixWindow.formFactor === "Mobile";

$w.onReady(function () {
    const cachedOpts = local.getItem("drop-opts")
    if( cachedOpts ) setDropOpts(JSON.parse(cachedOpts))

    getOpts().then(opts=>{
        if(!cachedOpts) setDropOpts(opts);
        local.setItem("drop-opts", JSON.stringify(opts))
    })
    .catch(console.error);

    $w('#btnLoadMore').onClick(()=>{
        currPage += 1;
        search();
    })

    $w('#btnSearch').onClick(() => {
        currPage = 1;
        search();
        if(isMobile) $w("#box106").scrollTo();
        else $w("#box6").scrollTo();
    });

    $w("#repeater1").onItemReady(($item, itemData, index) => {
        let sTitle = itemData.deliveryMessaging;
        if (sTitle === "" || sTitle === null || sTitle === undefined) {
            $item("#badge").hide();
        } else {
            $item("#badge").show();
            $item("#badge").expand();
        }

        $item("#textLocationD").text = itemData.area || "-";


        $item("#textMiles").expand();
        if( itemData.signedUp ) {
            // $item("#boxApproved").expand();

            $item('#textPriceM').expand();
            // $item("#textMiles").expand();
            $item('#textPriceDash').expand();

            $item("#textInfo").expand();
            $item("#textGuideShow").expand();

            $item('#btnCta').label = "Book this tailor";
            // Desktop
            $item("#textPriceD").expand();
            $item("#textGuideShowD").expand();
        }
        else {
            // $item("#boxApproved").collapse();

            $item('#textPriceM').collapse();
            // $item("#textMiles").collapse();
            // $item("#textMiles").text = "";
            // $item("#textMiles").expand();
            $item('#textPriceDash').collapse();

            // $item("#textMiles").expand()
            $item("#textInfo").collapse();
            $item("#textGuideShowD").collapse();
            $item("#textGuideShow").collapse();
            
            $item('#btnCta').label = "Request a quote";
            
            // Desktop
            $item("#textPriceD").collapse();
        }


        $item("#textGuideShow").onClick(()=>{
            $item('#boxGuideProcess').expand();
            $item("#textGuideHide").expand();
            $item('#textGuideShow').collapse();
        });

        $item("#textGuideHide").onClick(()=>{
            $item('#boxGuideProcess').collapse();
            $item('#textGuideShow').expand();
            $item("#textGuideHide").collapse();
        });
        
        $item("#textGuideShowD").onClick(()=>{
            $item('#boxGuideProcessD').expand();
            $item("#textGuideHideD").expand();
            $item('#textGuideShowD').collapse();
        });

        $item("#textGuideHideD").onClick(()=>{
            $item('#boxGuideProcessD').collapse();
            $item('#textGuideShowD').expand();
            $item("#textGuideHideD").collapse();
        });
    });

    search()

});

function setDropOpts({ item, material, needed, typesOfServicesTags }) {
    $w('#dropdownItem').options = item;
    $w('#dropdownMaterial').options = material;
    $w('#dropdownNeeded').options = needed;
    $w('#dropService').options = typesOfServicesTags;
    

    $w('#selectionTagsItem').options = item;
    $w('#selectionTagsMaterial').options = material;
    $w('#selectionTagsJobType').options = needed;
    $w('#selectionService').options = typesOfServicesTags;
}

// let itemMapMilesG;
async function search(page = currPage) {
    try {
        $w("#textResult").html = "";
        $w("#textLoading").expand();
        let postalId = $w("#iptPostalCode").value;
        let filterOpts = {};

        if (isMobile) {
            itemPerPage = 100;
            filterOpts = {
                clothingItems: $w("#selectionTagsItem").value,
                materials: $w("#selectionTagsMaterial").value,
                jobType: $w("#selectionTagsJobType").value,
                typesOfServicesTags: $w('#selectionService').value
            }
        } else {
            itemPerPage = 100
            filterOpts = {
                clothingItems: $w("#dropdownItem").value,
                materials: $w("#dropdownMaterial").value,
                jobType: $w("#dropdownNeeded").value,
                typesOfServicesTags: $w('#dropService').value
            }
        }

        let toInsertLog = {
            postCode: $w('#iptPostalCode').value,
            clothingItem: filterOpts.clothingItems,
            material: filterOpts.materials,
            service: filterOpts.jobType,
            typeOfService: filterOpts.typesOfServicesTags
        };

        wixData.insert("Logs", toInsertLog)

        const { items, itemMapMiles, hasError } =  await filterTailorWithMiles(filterOpts, postalId);
        // console.log("ALL MILES DATA",itemMapMiles)

        const tempItems = [...items];
        const currTotalItem = page * itemPerPage;
        const firstSlice = tempItems.splice(0, currTotalItem);
        const itemIds = firstSlice.map(itemData => itemData._id);
        
        if( currTotalItem >= items.length ) {
            $w('#boxLoadMore').collapse();
        } else {
            $w('#boxLoadMore').expand();
        }

        await $w("#newsDataset").setPageSize(currTotalItem)
        await $w("#newsDataset").setFilter(wixData.filter().hasSome("_id", itemIds))

        let filters = [ $w("#iptPostalCode").value ]

        if( !isMobile ) {
            filters = [
                ...filters,
                $w("#dropService").value,
                $w("#dropdownItem").value,
                $w("#dropdownMaterial").value,
                $w("#dropdownNeeded").value,

            ]
        }
        else {

            filters = [
                ...filters,
                ...$w("#selectionService").value,
                ...$w("#selectionTagsItem").value,
                ...$w("#selectionTagsMaterial").value,
                ...$w("#selectionTagsJobType").value
            ]
        }

        filters = filters.filter(Boolean).map(item=>item.toUpperCase())
        $w("#textLoading").collapse();
        if(filters.length !== 0) {
            $w("#textResult").html = `<h1 class="wixui-rich-text__text"><span class="wixui-rich-text__text">RESULTS FOR</span></h1>
<h1 class="wixui-rich-text__text"><span style="color:#7B61FF;" class="wixui-rich-text__text">${filters.join(", ")}</span></h1>`
        }


        $w("#repeater1").forEachItem(($item, itemData, index) => {
            // console.log("GETTING DATA", itemData)
            // console.log("ALL MILES DATA", itemMapMiles)
            // console.log("PARTICULAR MILES", itemMapMiles[itemData._id])
            if (typeof itemMapMiles[itemData._id] !== "undefined") {
                itemData.miles = itemMapMiles[itemData._id];
                const getMilesStr = `${itemMapMiles[itemData._id]} miles  -  `;
            
                $item("#miles").text = getMilesStr;
                $item("#textMiles").text = getMilesStr;

                $item("#textLocationD").text = `${getMilesStr}${itemData.area || " "}`

                $item("#textMiles").show();
                $item("#miles").show();
                $item("#text329").show();
                $item("#miles").expand();
                $item("#text329").expand();
            } else {
                $item("#textMiles").hide();
                $item("#miles").hide();
                $item("#textMiles").text = "";

                $item("#text329").hide();
                $item("#miles").collapse();
                $item("#text329").collapse();
            }
        });
        // sort based on miles
        if( postalId ) sorting(itemMapMiles, items);

    }
    catch(e) {
        console.error(e);
    }

}

function sorting(itemMapMiles, items) {
    if( Object.keys(itemMapMiles).length === 0 ) return;
    $w('#repeater1').data =items;
}

// export function viewGuidePricesButton_click(event) {
//     $w('#hideGuidePricesButton').show();
//     $w('#hideGuidePricesButton').expand();
//     $w('#viewGuidePricesButton').hide();
//     $w('#viewGuidePricesButton').collapse();

//     let $item = $w.at(event.context);

//     if ($item("#viewGuidePricesButton").text === "+ Show guide prices for Maz Tailoring") {
//         $w('#box75').show();
//         $w('#box75').expand();
//     }

//     if ($item("#viewGuidePricesButton").text === "THE WARDROBE CURATOR") {
//         $w('#box75').show();
//         $w('#box75').expand();
//     }

//     // if ($item("#text141").text === "Education and work experience"){
//     //     $w("#InterviewModule0103").expand();
//     // }                
//     else {
//         $w('#box75').show();
//         $w("#box75").expand();

//     }
//     // console.log($item("#text141").text)

// }

// export function hideGuidePricesButton_click(event) {
//     $w('#box75').hide();
//     $w('#box75').collapse();
//     $w('#viewGuidePricesButton').show();
//     $w('#viewGuidePricesButton').expand();
// }

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

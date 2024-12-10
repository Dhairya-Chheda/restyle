//-------------Imports-------------//

import wixData from 'wix-data';
import wixWindow from 'wix-window';

//-------------Global Variables-------------//

// Current product.
let product;
var id;
import { authentication } from 'wix-members';
import { currentMember } from 'wix-members';

const isLoggedIn = authentication.loggedIn();
$w.onReady(async function () {
    $w('#resultsPages').onClick((event, $w) => {
        $w('#Reviews').loadMore();
    })

    //-------------Shows different local booking form for BLANC Marylebone-------------//

    $w("#dynamicDataset").onReady(() => {
        let tailor = $w("#dynamicDataset").getCurrentItem();

        // if (tailor.wixbookingsystem === true) {
        //     $w("#bookingformwix").show();
        //     $w("#bookingformwix").expand();
        // } else {
        //     $w("#bookingformwix").hide();
        //     $w("#bookingformwix").collapse();
        // }

        if (tailor.externalbookingsystem === true) {
            $w("#bookingformcustom").show();
            $w("#bookingformcustom").expand();
        } else {
            $w("#bookingformcustom").hide();
            $w("#bookingformcustom").collapse();
        }
    });

    //-------------Makes CTA link out to external link for bookings-------------//

    // $w("#dynamicDataset").onReady(() => {
    //     let tailor = $w("#dynamicDataset").getCurrentItem();

    //     if (tailor.bookNowLocalLink === true) {
    //         $w("#booknowlocallink").show();
    //         $w("#booknowlocallink").expand();
    //     } else {
    //         $w("#booknowlocallink").hide();
    //         $w("#booknowlocallink").collapse();
    //     }

    //     if (tailor.bookNowExternalLink === true) {
    //         $w("#booknowexternallink").show();
    //         $w("#booknowexternallink").expand();
    //         $w("#bookingformexternal").show();
    //         $w("#bookingformexternal").expand();
    //         // $w("#bookingformwix").hide();
    //         // $w("#bookingformwix").collapse();
    //         $w("#bookingformcustom").hide();
    //         $w("#bookingformcustom").collapse();
    //     } else {
    //         $w("#booknowexternallink").hide();
    //         $w("#booknowexternallink").collapse();

    //     }
    // });

    //-------------Makes 'Delivery coming soon / available coming soon'-------------//

    $w("#dynamicDataset").onReady(() => {
        let tailor = $w("#dynamicDataset").getCurrentItem();

        if (tailor.deliveryAvailable === true) {
            $w("#section30").show();
            $w("#section30").expand();
        } else {
            $w("#section30").hide();
            $w("#section30").collapse();
        }

    });

    $w("#dynamicDataset").onReady(() => {
        let tailor = $w("#dynamicDataset").getCurrentItem();

        if (tailor.twoTrustBadges === true) {
            $w("#trustbadge2").show();
            $w("#trustbadge2").expand();
        } else {
            $w("#trustbadge2").hide();
            $w("#trustbadge2").collapse();
        }

    });


    $w("#dynamicDataset").onReady(() => {
        let tailor = $w("#dynamicDataset").getCurrentItem();

        if (tailor.deliveryAvailable === true) {
            $w("#deliveryavailabletagprofile").show();
            $w("#deliveryavailabletagprofile").expand();
        } else {
            $w("#deliveryavailabletagprofile").hide();
            $w("#deliveryavailabletagprofile").collapse();
        }

    });


    $w('#reviewsRepeater').onItemReady(($w, itemData, index) => {
        if (itemData.recommends) {
            // Set the "recommend text.
            $w('#recommendation').text = 'I recommend this product.';
            // If the reviewer does not recommend the item:
        } else {
            // Set the "don't recomend" text.
            $w('#recommendation').text = "I don't recommend this product.";
        }

        // If a photo was uploaded for the review:
        if (itemData.photo) {
            // Set the image URL from the item data.
            $w('#reviewImage').src = itemData.photo;
            // Expand the image.
            $w('#reviewImage').expand();
        }

        // Set the ratings element's rating value.
        $w('#oneRating2').rating = itemData.rating;


        // Get the date that the review was entered.
        let date = itemData._createdDate;
        // Format the date according to the date format settings on the user's computer.
        $w('#submissionTime2').text = date.toLocaleString();
    })



    $w('#repeater1').onItemReady(($w, itemData, index) => {
        if (itemData.recommends) {
            // Set the "recommend text.
            $w('#recommendation').text = 'I recommend this product.';
            // If the reviewer does not recommend the item:
        } else {
            // Set the "don't recomend" text.
            $w('#recommendation').text = "I don't recommend this product.";
        }

        // If a photo was uploaded for the review:
        if (itemData.photo) {
            // Set the image URL from the item data.
            $w('#reviewImage').src = itemData.photo;
            // Expand the image.
            $w('#reviewImage').expand();
        }

        // Set the ratings element's rating value.
        $w('#oneRating').rating = itemData.rating;


        // Get the date that the review was entered.
        let date = itemData._createdDate;
        // Format the date according to the date format settings on the user's computer.
        $w('#submissionTime').text = date.toLocaleString();
    })






    product = $w('#dynamicDataset').getCurrentItem();
    console.log(product);

    initReviews();
    $w('#addReview').onClick(async () => {
        const dataForLightbox = {
            productId: product._id
        };
        // Open the "Review Box" lightbox, send it the object created above, and wait for it to close.
        let result = await wixWindow.openLightbox('Review Box', dataForLightbox);
        // After the review lightbox is closed, refresh the reviews dataset so the new review appears on the page.
        $w('#Reviews').refresh();
        // Reload the current products statistics to reflect the new rating.
        loadStatistics();
        // Show a thank you message.
        $w('#thankYouMessage').show();

    })
});
async function initReviews() {
    // Filter the "Reviews" dataset to contain only the reviews on the currently displayed product.
    await $w('#Reviews').setFilter(wixData.filter().eq('productId', product._id).eq("agreed", true));
    // Show the reviews after the filter was set and applied on the dataset	
    showReviews();
    // Load the current product's statistics using the loadStatistics() function.
    loadStatistics();
}
export function showReviews() {
    // If at least one review has been submitted:
    if ($w('#Reviews').getTotalCount() > 0) {
        // Expand the strip that displays the reviews.
        console.log(`count`);
        $w('#reviewsStrip').expand();
        // If there are no reviews:
    } else {
        console.log('no count');
        // Collapse the strip that displays the reviews.
        $w('#reviewsStrip').collapse(); //otherwise, hide it
    }
}

// Set the action that occurs when a user clicks the "Load More" text.
export function resultsPages_click(event, $w) {
    // Load additional reviews into the reviews repeater.

}
// Load the current product's statistics.
async function loadStatistics() {
    // Get the statistics data based on the current product's ID.
    const stats = await wixData.get('review-stats', product._id);
    // If statistics data for the product was found:
    if (stats) {
        // Compute the product's average rating by dividing the total points by the number of ratings.
        let avgRating = (Math.round(stats.rating * 10 / stats.count) / 10);
        // Compute the percentage of reviewers that recommend the product.
        let percentRecommended = Math.round(stats.recommended / stats.count * 100);
        // Get the ratings element.
        let ratings = $w('#generalRatings');
        // Set the ratings element's average rating to the value calculated above. 
        ratings.rating = avgRating;
        // Set the ratings element's number of ratings to the count value from the statistics data.
        ratings.numRatings = stats.count;
        // Set the text for the recommended percentage element.
        $w('#recoPercent').text = `${percentRecommended} % would recommend`;
        // Show the ratings element.
        $w('#generalRatings').show();
        // If there is no statistics data for the product:
    } else {
        // Set the text for the recommended percentage element to reflect the fact that there are no reviews.
        $w('#recoPercent').text = 'There are no reviews for this tailor yet';
    }
    // Show the recommended percentage element only after it is populated to avoid flickering.
    $w('#recoPercent').show();
}




// import {session} from "wix-storage"

// $w.onReady(function () {
//     let value = session.getItem("PostCodeToCarryOver")
//     $w("text249").text = value
// });


    $w("#dynamicDataset").onReady(() => {
        let tailor = $w("#dynamicDataset").getCurrentItem();

        if (tailor.signedUp === true) {
            $w("#booknowexternallink").show();
            $w("#booknowexternallink").expand();
            $w("#bookingformexternal").show();
            $w("#bookingformexternal").expand();
            $w("#bookwithconfidencesignupsection").show();
            $w("#bookwithconfidencesignupsection").expand();

        } else {
            $w("#requestaquoteCTA").show();
            $w("#requestaquoteCTA").expand();
            $w("#bookwithconfidencesignupsection").hide();
            $w("#bookwithconfidencesignupsection").collapse();
            $w("#bookwithconfidencenonsignupsection").show();
            $w("#bookwithconfidencenonsignupsection").expand();
            $w("#text141").hide();
            $w("#text141").collapse();
            $w("#text145").hide();
            $w("#text145").collapse();
            $w("#booknowexternallink").hide();
            $w("#booknowexternallink").collapse();
            $w("#moreinfoCTA").hide();
            $w("#moreinfoCTA").collapse();
            $w("#bookingformexternal").hide();
            $w("#bookingformexternal").collapse();
            $w("#bookingFormNSU").show();
            $w("#bookingFormNSU").expand();
        }

    });
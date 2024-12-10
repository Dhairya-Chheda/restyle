//-------------Imports-------------//

import wixWindow from 'wix-window';
import wixData from 'wix-data';

//-------------Global Variables-------------//

// Current product's ID. 
let productId;

//-------------Lightbox Setup-------------//

$w.onReady(function () {
	// Get the data passed by the page that opened the lightbox.
	productId = wixWindow.lightbox.getContext().productId;
	console.log();
	
	// Set the action that occurs before the review is saved.
	$w('#SubmitReviews').onBeforeSave(() => {
		// If no rating was set:
		if ($w('#radioRating').value === '') {
			// Display an error message.
			$w('#rateError').show();
			// Force the save to fail.
			return Promise.reject(); 
		}

		// If a rating was set, set the element values into the fields of the dataset item.
		// These values will be saved in the collection.
		$w('#SubmitReviews').setFieldValues({
			productId,
			rating: $w('#radioRating').value,
			recommends: $w('#radioGroup1').value
		});
	});
	
	// Set the action that occurs after the review is saved.
	$w('#SubmitReviews').onAfterSave(async () => {
		// Update the product's statistics using the updateStatistics() function.
		await updateStatistics($w('#radioGroup1').value);
		// When the statistics have been updated, close the lightbox to return the user to the product page.
		wixWindow.lightbox.close(); 
	});
	$w('#radioRating').onChange((event, $w)=>{
		$w('#rateError').hide();
	})
});

// Update (or create) the product statistics.
async function updateStatistics(isRecommended) {
	// Get the review statistics for the current product from the "review-stats" collection.
	let stats = await wixData.get('review-stats', productId);

	// If statistics data already exist for this product:
	if (stats) {
		// Add the new rating to the total rating points.
		stats.rating += parseInt($w('#radioRating').value, 10); 
		// Increase the ratings count by 1.
		stats.count += 1; 
		// Increase the recommendations by one if the user recommends the product.
		stats.recommended += (isRecommended === "true") ? 1 : 0;
		// Update the new product statistics in the "review-stats" collection.  
		return wixData.update('review-stats', stats)
	}
	//If no statistics data exists for this product, create a new statistics item. 
	stats = {
		// Set the statistics item's ID to the current product's ID.
		_id: productId,
		// Set the statistics item's rating to the rating entered by the user.
		rating: parseInt($w('#radioRating').value, 10),
		// Set the statistics item's ratings count to 1 because this is the first rating.
		count: 1,
		// Set the statistics item's recommended property to 1 if the user recommends the product.
		recommended: (isRecommended === "true") ? 1 : 0
	};
	// Insert the new product statistics item into the "review-stats" collection.
	return wixData.insert('review-stats', stats)
}

//-------------Event Handlers-------------//

// Set the action that occurs when a rating is chosen.
export function radioRating_change(event, $w) {
	// Hide the error message.
	
}
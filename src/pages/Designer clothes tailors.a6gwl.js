$w.onReady(function () {
    $w('#dataset1').onReady(() => {
        $w('#repeater2').onItemReady(($item, itemData) => {
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
import wixAnimations from 'wix-animations';
import wixWindow from 'wix-window';

const runningTxt = wixAnimations.timeline({ repeat: -1 });
const runningTxt2 = wixAnimations.timeline({ repeat: -1 });
const runningTxt3 = wixAnimations.timeline({ repeat: -1 });


$w.onReady(function () {
    playInfiniteScroll()
});

 

function playInfiniteScroll(){
    let sliderWidth;

    wixWindow.getBoundingRect()

    .then((windowSizeInfo)=>{

        let windowWidth = windowSizeInfo.window.width;
        if(windowWidth > 1000){
            sliderWidth = 3126 / 3; //Desktop
        } else if(windowWidth >= 751){
            sliderWidth = 3126 / 3; //Tablet
        } else if(windowWidth <= 750){
            sliderWidth = 3126 / 3; // Mobile
        }

        runningTxt.add($w('#text221'), {
            x: -sliderWidth,
            duration: 12000,
            easing:'easeLinear'
        }).play()

        runningTxt2.add($w('#text222'), {
            x: -sliderWidth,
            duration: 12000,
            easing:'easeLinear'
        }).play()

        runningTxt3.add($w('#text223'), {
            x: -sliderWidth,
            duration: 12000,
            easing:'easeLinear'
        }).play()



        $w('#box1').onViewportEnter(()=>{
            runningTxt.play()
            runningTxt2.play()
            runningTxt3.play()

        }).onViewportLeave(()=>{
            runningTxt.pause();
            runningTxt2.pause()
            runningTxt3.pause()

        });

    })

}





const runninglogo = wixAnimations.timeline({ repeat: -1 });
const runninglogo2 = wixAnimations.timeline({ repeat: -1 });
const runninglogo3 = wixAnimations.timeline({ repeat: -1 });
const runninglogo4 = wixAnimations.timeline({ repeat: -1 });



$w.onReady(function () {
    playInfiniteScroll2()
});

 

function playInfiniteScroll2(){
    let sliderWidth;

    wixWindow.getBoundingRect()

    .then((windowSizeInfo)=>{

        let windowWidth = windowSizeInfo.window.width;
        if(windowWidth > 1000){
            sliderWidth = 1135 / 2; //Desktop
        } else if(windowWidth >= 751){
            sliderWidth = 1135 / 2; //Tablet
        } else if(windowWidth <= 750){
            sliderWidth = 1135 / 2; // Mobile
        }

        runninglogo.add($w('#box78'), {
            x: -sliderWidth,
            duration: 8000,
            easing:'easeLinear'
        }).play()

        runninglogo2.add($w('#box80'), {
            x: -sliderWidth,
            duration: 8000,
            easing:'easeLinear'
        }).play()

        runninglogo3.add($w('#'), {
            x: -sliderWidth,
            duration: 4000,
            easing:'easeLinear'
        }).play()

        runninglogo4.add($w('#'), {
            x: -sliderWidth,
            duration: 4000,
            easing:'easeLinear'
        }).play()



        $w('#box72').onViewportEnter(()=>{
            runninglogo.play()
            runninglogo2.play()
            runninglogo3.play()
            runninglogo4.play()


        }).onViewportLeave(()=>{
            runninglogo.pause();
            runninglogo2.pause()
            runninglogo3.pause()
            runninglogo4.pause()


        });

    })

}

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
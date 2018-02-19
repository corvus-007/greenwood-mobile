window.flat = (function() {
  'use strict';

  var flat = document.querySelector('.flat');

  if (!flat) {
    return;
  }

  init();

  function init() {
    var flat = document.querySelector('.flat');
    var flatPlans = flat.querySelectorAll('.flat__plan');

    function processingPlan(plan) {
      var planAdjuster = plan.querySelector('.flat-plan__adjuster');
      var planImage = plan.querySelector('.flat-plan__image');

      function updatePlanAdjuster(ratio) {
        planAdjuster.style.paddingTop = ratio * 100 + '%';
      }

      updatePlanAdjuster(getImageRatio(planImage));

      planImage.addEventListener('load', function() {
        updatePlanAdjuster(getImageRatio(planImage));
      });

      planImage.addEventListener('click', function(event) {
        planImage.classList.toggle('flat-plan__image--scale');
      });
    }

    function getImageRatio(image) {
      return image.naturalHeight / image.naturalWidth;
    }

    flatPlans.forEach(processingPlan);
  }

  return {
    init: init
  };
})();

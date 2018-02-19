window.contactsDirectors = (function() {
  var formContactManager = document.forms['form-contact-manager'];

  if (!formContactManager) {
    return;
  }

  $('[data-fancybox-director]').fancybox({
    afterShow: function(instance, current) {
      var formContactManager = document.forms['form-contact-manager'];
      var inputEmail = formContactManager.elements.contact_manager_target_email;
      var inputName = formContactManager.elements.contact_manager_target_name;
      var $btn = instance.$lastFocus;
      var directorEmail = $btn.data('contact-director-target-email');
      var $director = $btn.closest('.contacts-directors__item');
      var directorName = $director
        .find('.contacts-directors__name')
        .text()
        .trim()
        .replace(/\s{2,}/g, ' ');

      inputEmail.value = directorEmail;
      inputName.value = directorName;
    }
  });

  // Send form
  $(formContactManager).on('submit', function(event) {
    event.preventDefault();
    var url = this.action;
    var $form = $(this);
    var formData = new FormData(this);
    formData.append('send_personal_form', '');

    var requestForm = $.ajax({
      url: url,
      data: formData,
      type: 'POST',
      contentType: false,
      processData: false
    });

    requestForm.done(function(response) {
      if (response === 'success') {
        setTimeout(function() {
          formContactManager.reset();
          $.fancybox.close(true);
          $.fancybox.open(
            '<div class="popup"><h2 class="popup__title">Спасибо. Сообщение отправлено!</h2></div>'
          );
        }, 200);
      } else {
        $.fancybox.close(true);
        $.fancybox.open(
          '<div class="popup"><h2 class="popup__title">Ошибка!</h2></div>'
        );
      }
    });

    requestForm.fail(function() {
      alert('Ошибка отправки запроса на сервер, повторите отправку позже.');
    });
  });
})();

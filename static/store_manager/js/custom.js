// manual entry form$
$('.btn.search').click(function() {
	$('.card.form-card-1').addClass('show');
});

$('.upload label input').change(function(e) {
	var fileName = e.target.files[0].name;
	$('#file').show();
	$('#file').html(fileName);
});

$('.upload .btn-upload').click(function() {
	alert();
	$(this).parent().hide();
	$('.col-assign').show();
});

$('.col-assign .btn-next').click(function() {
	$(this).parent().find('h5.active').hide();
	$(this).parent().find('h5.active').next().addClass('active');
});

// change pass
$('.otp-text').keyup(function() {
	if (this.value.length == this.maxLength) {
		$(this).next('.otp-text').focus();
	}
});
$('.btn-otp').click(function() {
	$('.old-pas').hide();
	$('.otp').fadeIn();
	$('#dig-1').focus();
});
$('.pass').click(function() {
	$('.login-pass').fadeIn();
	$('.login-otp').hide();
});

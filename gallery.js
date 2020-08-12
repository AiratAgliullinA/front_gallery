var num_image = 1;
/* handling add images */
$(".container__form .container__form__input.container__form__input_add-images").click(function() {
	var url_image = $(".container__form .container__form__input.container__form__input_url-img").val();
	$(".container__form .container__form__input.container__form__input_url-img").val("");
	
	type_image = url_image.split('.').pop();
	if (type_image == "json") {
		ajaxRequestToJsonFile(url_image);
	} else if (type_image == "jpg" || type_image == "png") {
		addImageSrc(url_image);
	}
});
/* drag-n-drop */
$(document).ready(function() {	
	$('.container__form__drag-n-drop').on({
	    'dragover dragenter': function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        $('.container__form .container__form__drag-n-drop').addClass('hover');
	    },
	    'dragleave': function(e) {
	        $('.container__form .container__form__drag-n-drop').removeClass('hover');
	    },
	    'drop': function(e) {
	    	$('.container__form .container__form__drag-n-drop').removeClass('hover');
	    	var dataTransfer = e.originalEvent.dataTransfer;
	      	if (dataTransfer && dataTransfer.files.length) {
			    e.preventDefault();
			    e.stopPropagation();
			    $.each(dataTransfer.files, function(i, file) {
			      var reader = new FileReader();
			      reader.onload = $.proxy(function(file, $fileList, event) {
			      	if (file.type == "image/jpeg" || file.type == "image/png") {
				    	addImageSrc(event.target.result);
				    } else if (file.type == "application/json") {
				    	handlingJsonFile(JSON.parse(event.target.result));
				    }
			      }, this, file, $(".container__form__drag-n-drop .container__form__drag-n-drop__file"));
			      if (file.type == "image/jpeg" || file.type == "image/png") {
			      	reader.readAsDataURL(file);
			      } else if (file.type == "application/json") {
			      	reader.readAsText(file);
			      }
			    });
			}
	    }
	});
});
/**/
/* ajax request and handling json file */
function ajaxRequestToJsonFile(url_images) {
	$.ajax({
		url: url_images,
		dataType: 'json', 
		cache: false,
		success: function(data) {
        	handlingJsonFile(data);
      	}
    });
}
function handlingJsonFile(images) {
	$.each(images.galleryImages, function(index, value) {
    	addImageSrc(value.url);
    });
}
/**/
/* delete image */
function deleteImageBlock(row) {
	$(".container__list-images .container__list-images__div_num-row-" + row).fadeOut(function() { 
		$(this).remove(); 
	});
	for (var i = row + 1; i < num_image; i++) {
		$(".container__list-images .container__list-images__div_num-row-" + i).attr("class", "container__list-images__div container__list-images__div_num-row-" + (i - 1));
		$(".container__list-images__div .container__list-images__div__img_num-row-" + i).attr("class", "container__list-images__div__img container__list-images__div__img_num-row-" + (i - 1));
		$(".container__list-images__div .container__list-images__div__delete-icon_num-row-" + i).attr("onclick", "deleteImageBlock(" + (i - 1) + ");");
		$(".container__list-images__div .container__list-images__div__delete-icon_num-row-" + i).attr("class", "container__list-images__div__delete-icon container__list-images__div__delete-icon_num-row-" + (i - 1) + " fa fa-trash");
	}
	num_image--;
	resizeImages();
}
/**/
/* add image src */
function addImageSrc(src) {
	var img = new Image();
	img.onload = function () { 
		$(".container .container__list-images").append("<div style=\"display: none;\" class=\"container__list-images__div container__list-images__div_num-row-" + num_image + "\"><img class=\"container__list-images__div__img container__list-images__div__img_num-row-" + num_image + "\" src=\"" + src + "\" /><i onclick=\"deleteImageBlock(" + num_image + ");\" class=\"container__list-images__div__delete-icon container__list-images__div__delete-icon_num-row-" + num_image + " fa fa-trash\" aria-hidden=\"true\"></i></div>");
		loadImages(num_image);
		num_image++;
		resizeImages();
	}
	img.src = src;
}
/**/
/* load images */
function loadImages(row) {
	$(".container__list-images .container__list-images__div_num-row-" + row).fadeIn(1500);
}
/**/
/* resize images */
function resizeImages() {
	var width_container = $('.container').width();
	var sum_width_img_in_row = 0;
	var start_num_image = 1;
	$(".container__list-images .container__list-images__div").attr('style', '');
	$(".container__list-images__div .container__list-images__div__img").attr('style', '');
	for (var i = 1; i < num_image; i++) {
		var sum_margin_right_left_block_image = parseInt($(".container__list-images .container__list-images__div").css("marginRight")) + parseInt($(".container__list-images .container__list-images__div").css("marginLeft"));
		sum_width_img_in_row += $(".container__list-images__div .container__list-images__div__img_num-row-" + i).width() + sum_margin_right_left_block_image;

		if (width_container > sum_width_img_in_row) {
			if (start_num_image == i) {
				start_num_image = i;
			}
		} else {
			var empty_width_container = width_container - (sum_width_img_in_row - $(".container__list-images__div .container__list-images__div__img_num-row-" + i).width());
			var divided_empty_width_container = empty_width_container / (i - start_num_image);
			for (var count = i - 1; count >= start_num_image; count--) {
				$(".container__list-images .container__list-images__div_num-row-" + count).width($(".container__list-images .container__list-images__div_num-row-" + count).width() + divided_empty_width_container);
				$(".container__list-images__div .container__list-images__div__img_num-row-" + count).css({"width" : "100%"});
				$(".container__list-images__div .container__list-images__div__img_num-row-" + count).css({"height" : "100%"});
			}
			start_num_image = i;
			sum_width_img_in_row = $(".container__list-images__div .container__list-images__div__img_num-row-" + i).width() + sum_margin_right_left_block_image;
		}
	}	
}
$(window).resize(function() {
	resizeImages();
});
/**/
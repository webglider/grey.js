/**
 * Simple filters for greyscale images.
 * Using Image Data from canvas
 *
 * (C) 2014 Midhul Varma
 */

//Grey object
var Grey;

//initializing filter functions for ImageData object
Grey.initFilters = function(img) {

	//automatically greyscale image
	for (var x = 0; x < img.width; x++) {
		for (var y = 0; y < img.height; y++) {
			var i = x * 4 + y * 4 * img.width;
			var luma = Math.floor(img.data[i] * 299 / 1000 +
				img.data[i + 1] * 587 / 1000 +
				img.data[i + 2] * 114 / 1000);

			img.data[i] = luma;
			img.data[i + 1] = luma;
			img.data[i + 2] = luma;
			img.data[i + 3] = 255;
		}
	}

	//method to create 2D pixel array
	img.pixRead = function() {
		this.pix = new Array(this.width);
		for (var i = 0; i < this.width; i++) {
			this.pix[i] = new Array(this.height);
			for (var j = 0; j < this.height; j++) {
				var pos = ((j) * (this.width * 4)) + ((i) * 4);
				this.pix[i][j] = {val: this.data[pos], x: i, y: j};
			}
		}
	}

	//method to load pixel data
	img.pixLoad = function() {
		for(var i=0; i < this.width; i++) {
			for(var j=0; j < this.height; j++) {
				var pos = ((j) * (this.width * 4)) + ((i) * 4);
				this.data[pos] = this.pix[i][j].val;
				this.data[pos+1] = this.pix[i][j].val;
				this.data[pos+2] = this.pix[i][j].val;
			}
		}
	}

	//method to get neighbours array
	//returns array of pixels
	img.neighbours = function(pixel) {
		var i = pixel.x;
		var j = pixel.y;
		var f = this.pix;
		return [f[i][j-1],f[i][j+1],f[i-1][j-1],f[i-1][j],f[i-1][j+1],f[i+1][j-1],f[i+1][j],f[i+1][j+1]];
	}

	//method to get 3x3 cross around pixel (includes pixel)
	img.cross = function(pixel) {
		var i = pixel.x;
		var j = pixel.y;
		var f = this.pix;
		var res = [pixel, f[i][j-1], f[i][j+1]];
		if(f[i-1]) res.push(f[i-1][j]);
		if(f[i+1]) res.push(f[i+1][j], f[i+1][j+1]);

		return res;
		

	}

	//treshold filter
	img.treshold = function(tresh) {
		for(var i=0; i< this.width; i++) {
			for(var j =0; j < this.height; j++) {
				if(this.pix[i][j].val > tresh) this.pix[i][j].val = 255;
			}
		}
	}

	//dilate 
	img.dilate = function() {
		//copy of pix array
		var newpix = JSON.parse(JSON.stringify(this.pix));

		for(var i=0; i< this.width; i++) {
			for(var j =0; j< this.height; j++) {
				var cross = this.cross(this.pix[i][j]);
				var newval = 255;
				for(var k=0; k< cross.length; k++) {
					if(cross[k]) {
						newval = Math.min(newval, cross[k].val);
					}
				}
				//replace with max
				newpix[i][j].val = newval;
			}
		}

		//console.log(newpix);

		//copy back to pix
		this.pix = JSON.parse(JSON.stringify(newpix));
	}

	//erode
	img.erode = function() {
		//copy of pix array
		var newpix = JSON.parse(JSON.stringify(this.pix));
		for(var i=0; i< this.width; i++) {
			for(var j =0; j< this.height; j++) {
				var cross = this.cross(this.pix[i][j]);
				var newval = -1;
				for(var k=0; k< cross.length; k++) {
					if(cross[k]) {
						newval = Math.max(newval, cross[k].val);
					}
				}
				//replace with min
				newpix[i][j].val = newval;
			}
		}

			//copy back to pix
		this.pix = JSON.parse(JSON.stringify(newpix));
	}

	//highlighting array of pixels
	img.highlight = function(pixArr) {
		for(var i=0; i< pixArr.length; i++) {
			pixArr[i].val = 0;
		}

	}







}

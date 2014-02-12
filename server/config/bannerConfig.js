module.exports = {
	variants: {
		guildBanner: {
			resize: {
				large: "200x50"
			},
			keepNames: true
		}
	},

	storage: {
		S3: {
			key: process.env.S3_KEY,
			secret: process.env.S3_SECRET_KEY,
			bucket: 'globe-' + process.env.NODE_ENV,
			storageClass: 'REDUCED_REDUNDANCY'
		},
		uploadDirectory: 'banners/'
	},

	debug: true
};
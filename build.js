/**
*  Spinal Build
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	pkg = require('./package.json'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	_ = require('underscore'),
	_s = require('underscore.string');

var Build = {
	
	/**
	*	Build Run
	**/
	run: function() {
		output = this.concat();
		output = this.minify(output);
		this.export(output);
	},
	
	banner: function(o) {
		var b = '//     Spinal.js <%= version %>\n\n \
			//     (c) 2014 Patricio Ferreira, 3dimention.com\n \
			//     SpinalJS may be freely distributed under the MIT license.\n \
			//     For all details and documentation:\n \
			//     http://3dimention.github.io/spinal';
		return _s.insert(o, 0, _.template(b, { version: pkg.version }));
	},
	
	/**
	*	File Concatenation
	**/
	concat: function() {
		var files = process.argv.slice(2), out = '';
		files.forEach(function(f) { out += fs.readFileSync(f, 'utf8') + '\n'; });
		return _.template(out, { version: pkg.version });
	},
	
	/**
	*	Minification Process
	**/
	minify: function(o) {
		var ast = jsp.parse(o),
			ast = pro.ast_mangle(ast),
			ast = pro.ast_squeeze(ast),
			minified = pro.gen_code(ast);
		return this.banner(minified);
	},
	
	/**
	*	Export framework
	**/
	export: function(o) {
		var filename = './lib/' + pkg.name + '-' + pkg.version + '-SNAPSHOT.js';
		fs.writeFileSync(filename, o, { mode: 0777, encoding: 'utf8', flags: 'w' });
	}
	
};

Build.run();
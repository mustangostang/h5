"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _dateTime = require("./utils/dateTime.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var videoEvents = ["play", "pause", "playing", "abort", "progress", "ratechange", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "loadeddata", "loadedmetadata", "loadstart", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting", "error", "encrypted", "mozaudioavailable", "interruptbegin", "interruptend"];

var Video = function (_React$Component) {
	_inherits(Video, _React$Component);

	function Video(props, context) {
		_classCallCheck(this, Video);

		// store all public handler here, and return this api object to parent component;
		var _this = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this, props, context));

		_this.api = {};
		var pubHandlers = ["togglePlay", "setTime", "fullscreen", "volume"];
		// save public handlers to api object
		pubHandlers.forEach(function (name) {
			_this["_" + name] = _this.api[name] = _this["_" + name].bind(_this);
		});
		// manually bind all handlers
		var handlers = ["metaDataLoaded", "timeupdate", "durationchange", "progress", "onEnded", "onVolumeChange", "onFullscreen"];
		handlers.forEach(function (name) {
			return _this["_" + name] = _this["_" + name].bind(_this);
		});

		return _this;
	}

	_createClass(Video, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			/**
    * register some video event listener here;
    */
			this.$wraper = _reactDom2.default.findDOMNode(this);
			var $video = this.$video = this.api.$video = _reactDom2.default.findDOMNode(this.refs.video);
			// window.$video = $video;
			$video.addEventListener("loadedmetadata", this._metaDataLoaded);
			$video.addEventListener("ended", this._onEnded);
			$video.addEventListener("volumechange", this._onVolumeChange);
			$video.addEventListener("requestFullScreen", this._onFullscreen);
			$video.addEventListener("cancelFullscreen", this._onExitFullscreen);

			// this update interval gap is too big make progressbar not snapy
			// $video.addEventListener("timeupdate", this._timeupdate )
			$video.addEventListener("progress", this._progress);

			if (this.props.autoPlay && !this.seekbarUpdateTimer) this.seekbarUpdateInterval();
		}
	}, {
		key: "_onEnded",
		value: function _onEnded(e) {
			//console.log("metadata loaded")
			if (this.props.onEnded && typeof this.props.onEnded == "function") {
				this.props.onEnded(this.api);
			}
		}
	}, {
		key: "_onVolumeChange",
		value: function _onVolumeChange(e) {
			if (this.props.onVolumeChange && typeof this.props.onVolumeChange == "function") {
				this.props.onVolumeChange(this.state.volume);
			}
		}
	}, {
		key: "_onFullscreen",
		value: function _onFullscreen() {
			if (this.props.onFullscreen && typeof this.props.onFullscreen == "function") {
				this.props.onFullscreen();
			}
		}
	}, {
		key: "_onExitFullscreen",
		value: function _onExitFullscreen() {
			if (this.props.onExitFullscreen && typeof this.props.onExitFullscreen == "function") {
				this.props.onExitFullscreen();
			}
		}
		/**
   * after metaData Loaded we can get video dimentions and set width,height of video wraper;
   */

	}, {
		key: "_metaDataLoaded",
		value: function _metaDataLoaded(e) {
			//console.log("metadata loaded")
			if (this.props.metaDataLoaded && typeof this.props.metaDataLoaded == "function") {
				this.props.metaDataLoaded(this.api);
			}

			// calculate width of seek bar and progress;
			this.$seekbarWraper = _reactDom2.default.findDOMNode(this.refs.seekbarWraper);
			this.setState({ duration: (0, _dateTime.formatTime)(this.$video.duration) });
		}
	}, {
		key: "seekbarUpdateInterval",
		value: function seekbarUpdateInterval() {
			this.seekbarUpdateTimer = setInterval(this._timeupdate, 80);
		}
	}, {
		key: "_setTime",
		value: function _setTime(percent, isPercent) {
			if (this.state.seekDisabled) return;
			if (isPercent && percent > 100) return;
			var time = isPercent ? percent * this.$video.duration / 100 : percent;
			//console.log("change time", time )
			if (this.$video.fastSeek) {
				this.$video.fastSeek(time);
			} else {
				this.$video.currentTime = time;
			}

			this.setState({ seekProgress: percent });
		}

		// update seek bar width;

	}, {
		key: "_timeupdate",
		value: function _timeupdate(e) {
			var percent = this.$video.currentTime / this.$video.duration * 100;
			var newState = {
				seekProgress: percent,
				currentTime: (0, _dateTime.formatTime)(this.$video.currentTime)
			};
			if (this.$video.currentTime >= this.$video.duration) {
				newState.isPlaying = false;
			}
			this.setState(newState);
		}
	}, {
		key: "_durationchange",
		value: function _durationchange() {}

		// loading progress bar

	}, {
		key: "_progress",
		value: function _progress(e) {
			var buf = this.$video.buffered;
			var total = 0;
			for (var ii = 0; ii < buf.length; ii++) {
				total += buf.end(ii) - buf.start(ii);
			}
			this.setState({ loadedProgress: total / this.$video.duration * 100 });
		}
	}, {
		key: "_togglePlay",
		value: function _togglePlay() {
			//console.log("toggle play")
			if (!this.seekbarUpdateTimer) this.seekbarUpdateInterval();

			if (!this.state.isPlaying) {
				if (this.$video.currentTime >= this.$video.duration) this.$video.currentTime = 0;
				this.$video.play();
				this.setState({ isPlaying: true });
			} else {
				this.$video.pause();
				this.setState({ isPlaying: false });
			}
		}
	}, {
		key: "_fullscreen",
		value: function _fullscreen(e) {
			var apis = ["requestFullScreen", "mozRequestFullScreen", "webkitRequestFullscreen", "msRequestFullscreen"];
			for (var ii = 0; ii < apis.length; ii++) {
				if (this.$video[apis[ii]]) return this.$video[apis[ii]]();
			}
		}
	}, {
		key: "_volume",
		value: function _volume(val) {
			if (val <= 0) val = 0;
			if (val > 1) val = 1;
			this.$video.volume = val;
			var state = {
				volume: val,
				isMuted: val <= 0.05 ? true : false
			};
			this.setState(state);
		}
	}, {
		key: "_setSubtitle",
		value: function _setSubtitle(index) {
			//console.log("_setSubtitle",index)
			if (this.$video.textTracks[this.state.activeSubtitle]) this.$video.textTracks[this.state.activeSubtitle].mode = "disabled";
			this.$video.textTracks[index].mode = "showing";
			this.setState({ activeSubtitle: index });
		}
	}, {
		key: "$getSubtitleTracksMenu",
		value: function $getSubtitleTracksMenu() {
			var _this2 = this;

			var $menuItems = [];
			if (!this.$video || this.$video.textTracks.length <= 0) return $menuItems;

			var _loop = function _loop(ii) {
				var track = _this2.$video.textTracks[ii];
				$menuItems.push(_react2.default.createElement(
					"li",
					{ key: ii },
					_react2.default.createElement(
						"button",
						{ onClick: function onClick(e) {
								return _this2._setSubtitle(ii);
							} },
						track.label
					)
				));
			};

			for (var ii = 0; ii < this.$video.textTracks.length; ii++) {
				_loop(ii);
			}
			this.subTitleMenu = _react2.default.createElement(
				"span",
				{ className: "r5-subtitle" },
				_react2.default.createElement(
					"button",
					null,
					this.icons.subtitles
				),
				_react2.default.createElement(
					"ul",
					{ className: "r5-subtitle-menu" },
					$menuItems
				)
			);
			return this.subTitleMenu;
		}

		// generate subtitle tracks: <track >

	}, {
		key: "$getSubtitleTracks",
		value: function $getSubtitleTracks(subtitles) {
			if (!Array.isArray(subtitles)) return "";
			var $tracks = [];
			for (var ii = 0; ii < subtitles.length; ii++) {
				var track = subtitles[ii];
				$tracks.push(_react2.default.createElement("track", { src: track.src, kind: "subtitles", srcLang: track.lang, label: track.label, key: ii }));
			}
			return $tracks;
		}
	}, {
		key: "$getSource",
		value: function $getSource(sources) {
			if (!Array.isArray(sources)) return [];
			var $sources = [];
			for (var ii = 0; ii < sources.length; ii++) {
				var ss = sources[ii];
				var extName = _path2.default.extname(ss).substr(1).split('?')[0];
				$sources.push(_react2.default.createElement("source", { src: ss, type: "video/" + extName, key: ii }));
			}
			return $sources;
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _props = this.props;
			var subtitles = _props.subtitles;
			var loop = _props.loop;
			var autoPlay = _props.autoPlay;
			var poster = _props.poster;
			var preload = _props.preload;
			var sources = _props.sources;
			var controlPanelStyle = _props.controlPanelStyle;
			var autoHideControls = _props.autoHideControls;
			//html5 video options

			var options = { loop: loop, autoPlay: autoPlay, poster: poster, preload: preload };
			var wraperStyle = {},
			    contentWraperStyle = {};
			var $video = this.$video || {};
			$video.volume = this.props.volume;
			var vWidth = this.props.width || $video.videoWidth || $video.clientWidth;
			var vHeight = this.props.height || $video.videoHeight || $video.clientHeight;
			options.width = vWidth;
			options.height = vHeight;
			wraperStyle.width = vWidth + "px";
			wraperStyle.height = contentWraperStyle.height = vHeight + "px";
			if (this.props.controlPanelStyle == "fixed") wraperStyle.height = vHeight + 50 + "px";

			var controlsClass = "r5-controls r5-controls--" + controlPanelStyle + " " + (autoHideControls ? "r5-auto-hide" : "") + " ";
			if (!this.props.controls) controlsClass = "r5-controls-hidden";

			return _react2.default.createElement(
				"div",
				{ className: "r5-wraper", style: wraperStyle },
				_react2.default.createElement(
					"div",
					{ className: "video-flex-wrapper" },
					_react2.default.createElement(
						"video",
						_extends({ ref: "video" }, options),
						this.$getSource(sources),
						subtitles && subtitles.length > 0 ? this.$getSubtitleTracks(subtitles) : ""
					)
				),
				_react2.default.createElement(
					"div",
					{ className: "r5-overlay", onClick: this._togglePlay },
					!this.$video || this.$video.currentTime <= 0 ? this.icons.playCircle : ""
				),
				_react2.default.createElement(
					"div",
					{ className: "r5-content", style: contentWraperStyle },
					this.props.children
				),
				_react2.default.createElement(
					"div",
					{ className: controlsClass },
					_react2.default.createElement(
						"div",
						{ className: "r5-seekbar-wraper", ref: "seekbarWraper" },
						_react2.default.createElement("div", { className: "r5-seekbar-loaded", ref: "seekbar", style: { width: this.state.loadedProgress + "%" } }),
						_react2.default.createElement("div", { className: "r5-seekbar", ref: "loadedbar", style: { width: this.state.seekProgress + "%" } }),
						_react2.default.createElement("input", { type: "range", min: "0.0", max: "100.0", step: "0.5",
							value: this.state.seekProgress,
							onChange: function onChange(e) {
								return _this3._setTime(e.target.value, true);
							} })
					),
					_react2.default.createElement(
						"div",
						{ className: "r5-panel" },
						_react2.default.createElement(
							"button",
							{ className: "r5-play", onClick: this._togglePlay },
							this.state.isPlaying ? this.icons.pause : this.icons.play
						),
						_react2.default.createElement(
							"div",
							{ className: "r5-volume" },
							_react2.default.createElement("div", { className: this.state.isMuted ? "volume-icon muted" : this.state.volume > .7 ? "volume-icon high" : "volume-icon medium" }),
							_react2.default.createElement(
								"div",
								{ className: "r5-volume-inner", style: { width: "71px" } },
								_react2.default.createElement("div", { className: "r5-volume-bar", style: { width: this.state.volume * 100 + "%" } }),
								_react2.default.createElement("input", { type: "range", min: "0", max: "1", step: "0.05", value: this.state.volume, onChange: function onChange(e) {
										return _this3._volume(e.target.value);
									} })
							)
						),
						_react2.default.createElement(
							"div",
							{ className: "r5-timecode" },
							_react2.default.createElement(
								"span",
								{ className: "current-time" },
								this.state.currentTime
							),
							_react2.default.createElement(
								"span",
								{ className: "duration" },
								this.state.duration
							)
						),
						_react2.default.createElement("div", { className: "r5-fullscreen", onClick: this._fullscreen })
					)
				)
			);
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {

			this.state = {
				isPlaying: this.props.autoPlay ? true : false,
				isMuted: false,
				currentTime: "00:00",
				duration: "00:00",
				loadedProgress: 0,
				seekProgress: 0, // how much has played
				volume: this.props.volume,
				activeSubtitle: null,
				seekDisabled: this.props.seekDisabled ? true : false
			};

			// var fill = this.props.controlPanelStyle == "overlay"?"#ffffff":"#3FBA97";
			var fill = "#ffffff";
			this.icons = {};
			this.icons.play = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M8 5v14l11-7z", fill: fill }),
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
			);
			this.icons.pause = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z", fill: fill }),
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
			);
			this.icons.playCircle = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
				_react2.default.createElement("path", { d: "M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z", fill: fill })
			);
			this.icons.volumeUp = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z", fill: fill }),
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
			);
			this.icons.volumeDown = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z", fill: fill }),
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
			);
			this.icons.mute = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M7 9v6h4l5 5V4l-5 5H7z", fill: fill }),
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
			);
			this.icons.subtitles = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
				_react2.default.createElement("path", { d: "M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z", fill: fill })
			);
			this.icons.fullscreen = _react2.default.createElement(
				"svg",
				{ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
				_react2.default.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
				_react2.default.createElement("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z", fill: fill })
			);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.seekbarUpdateTimer) clearInterval(this.seekbarUpdateTimer);
			var $video = this.$video;
			if ($video) {
				$video.removeEventListener("loadedmetadata", this._metaDataLoaded);
				$video.removeEventListener("ended", this._onEnded);
				$video.removeEventListener("volumechange", this._onVolumeChange);
				$video.removeEventListener("progress", this._progress);
				$video.pause();
				$video.src = ""; // Stops download.
				$video.load();
			}
		}
	}]);

	return Video;
}(_react2.default.Component);

Video.propTypes = {
	// callbacks
	metaDataLoaded: _react2.default.PropTypes.func, // video's meta data loaded, return video element
	onEnded: _react2.default.PropTypes.func,
	onVolumeChange: _react2.default.PropTypes.func,

	// properties
	sources: _react2.default.PropTypes.array,
	subtitles: _react2.default.PropTypes.array, // [{src:"foo.vtt", label:"English",srclan:"en" }]
	autoPlay: _react2.default.PropTypes.bool,
	controls: _react2.default.PropTypes.bool,
	autoHideControls: _react2.default.PropTypes.bool,
	controlPanelStyle: _react2.default.PropTypes.oneOf(["overlay", "fixed"]), // overlay, fixed
	preload: _react2.default.PropTypes.oneOf(["auto", "none", "metadata"]),
	loop: _react2.default.PropTypes.bool,
	mute: _react2.default.PropTypes.bool,
	poster: _react2.default.PropTypes.string,
	width: _react2.default.PropTypes.string,
	height: _react2.default.PropTypes.string,
	volume: _react2.default.PropTypes.number,
	seekDisabled: _react2.default.PropTypes.bool

};

Video.defaultProps = {
	autoPlay: false,
	loop: false,
	controls: true,
	autoHideControls: true,
	volume: 1.0,
	mute: false,
	controlPanelStyle: "overlay",
	preload: "auto",
	seekDisabled: false
};

exports.default = Video;
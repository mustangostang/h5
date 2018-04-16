import React from "react"
import ReactDOM from 'react-dom'
import path from "path"
import PropTypes from "prop-types";
import { formatTime } from "./utils/dateTime.js"

var videoEvents = ["play","pause","playing","abort","progress","ratechange","canplay","canplaythrough","durationchange","emptied","ended","loadeddata","loadedmetadata","loadstart","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","error","encrypted","mozaudioavailable","interruptbegin","interruptend"];

class Video extends React.Component {

	constructor(props,context){
		super(props,context)
		// store all public handler here, and return this api object to parent component;
		this.api = {};
		var pubHandlers = ["togglePlay","setTime","fullscreen","volume"];
		// save public handlers to api object
		pubHandlers.forEach( name => {
			this["_"+name] = this.api[name] = this["_"+name].bind(this)
		});
		// manually bind all handlers
		var handlers = ["metaDataLoaded","timeupdate","durationchange","progress","onEnded","onVolumeChange"];
		handlers.forEach( name => this["_"+name] = this["_"+name].bind(this) )

	}

	componentDidMount(){
		/**
		 * register some video event listener here;
		 */
		this.$wraper = ReactDOM.findDOMNode(this);
		var $video = this.$video = this.api.$video = ReactDOM.findDOMNode( this.refs.video )
		// window.$video = $video;
		$video.addEventListener("loadedmetadata", this._metaDataLoaded )
		$video.addEventListener("ended", this._onEnded )
		$video.addEventListener("volumechange", this._onVolumeChange )
		// this update interval gap is too big make progressbar not snapy
		// $video.addEventListener("timeupdate", this._timeupdate )
		$video.addEventListener("progress", this._progress )


		if( this.props.autoPlay && !this.seekbarUpdateTimer ) this.seekbarUpdateInterval();
	}


	_onEnded(e){
		//console.log("metadata loaded")
		if(this.props.onEnded && typeof this.props.onEnded == "function" ){
			this.props.onEnded( this.api );
		}
	}
	_onVolumeChange(e){
		if(this.props.onVolumeChange && typeof this.props.onVolumeChange == "function" ){
			this.props.onVolumeChange( this.state.volume );
		}
	}
	/**
	 * after metaData Loaded we can get video dimentions and set width,height of video wraper;
	 */
	_metaDataLoaded(e){
		//console.log("metadata loaded")
		if(this.props.metaDataLoaded && typeof this.props.metaDataLoaded == "function" ){
			this.props.metaDataLoaded( this.api );
		}

		// calculate width of seek bar and progress;
		this.$seekbarWraper = ReactDOM.findDOMNode( this.refs.seekbarWraper );
		this.setState({duration: formatTime(this.$video.duration) })
	}

	seekbarUpdateInterval(){
		this.seekbarUpdateTimer = setInterval( this._timeupdate, 80);
	}

	_setTime( percent, isPercent ){
		if(this.state.seekDisabled) return;
		if( isPercent && percent>100) return;
		var time = isPercent? percent * this.$video.duration / 100 : percent;
		//console.log("change time", time )
		if(this.$video.fastSeek ){
			this.$video.fastSeek(time)
		}else{
			this.$video.currentTime = time;
		}

		this.setState({seekProgress: percent });
	}

	// update seek bar width;
	_timeupdate(e){
		var percent = this.$video.currentTime / this.$video.duration * 100;
		var newState = {
			seekProgress: percent,
			currentTime: formatTime(this.$video.currentTime)
		}
		if(this.$video.currentTime >= this.$video.duration ) {
			newState.isPlaying = false;
		}
		this.setState(newState);
	}

	_durationchange(){

	}

	// loading progress bar
	_progress(e){
		var buf = this.$video.buffered;
		var total = 0;
		for( let ii = 0; ii<buf.length; ii++ ){
			total += buf.end(ii) - buf.start(ii);
		}
		this.setState({loadedProgress: total / this.$video.duration * 100 })
	}

	_togglePlay(){
		//console.log("toggle play")
		if( !this.seekbarUpdateTimer ) this.seekbarUpdateInterval();

		if(!this.state.isPlaying){
			if(this.$video.currentTime >= this.$video.duration ) this.$video.currentTime = 0;
			this.$video.play();
			this.setState({isPlaying: true})
		}else{
			this.$video.pause();
			this.setState({isPlaying: false})
		}
	}

	_fullscreen(e){
		var apis = ["requestFullScreen","mozRequestFullScreen","webkitRequestFullscreen","msRequestFullscreen"];
		for(var ii=0; ii<apis.length; ii++){
			if(this.$video[apis[ii]]) return this.$video[apis[ii]]();
		}
	}

	_volume( val ){
		if( val <= 0) val = 0;
		if(val >1) val = 1;
		this.$video.volume = val;
		var state = {
			volume: val,
			isMuted: val<= 0.05? true: false,
		};
		this.setState(state);
	}

	_setSubtitle( index ){
		//console.log("_setSubtitle",index)
		if( this.$video.textTracks[this.state.activeSubtitle] )
			this.$video.textTracks[this.state.activeSubtitle].mode = "disabled";
		this.$video.textTracks[index].mode = "showing";
		this.setState({activeSubtitle: index })
	}

	$getSubtitleTracksMenu(){
		var $menuItems = []
		if( !this.$video || this.$video.textTracks.length <= 0 ) return $menuItems;
		for(let ii=0; ii< this.$video.textTracks.length; ii++ ){
			let track = this.$video.textTracks[ii];
			$menuItems.push(
				<li key={ii}><button onClick={ e=>this._setSubtitle(ii) }>{ track.label }</button></li>
			)
		}
		this.subTitleMenu = (
			<span className="r5-subtitle">
				<button>{this.icons.subtitles}</button>
				<ul className="r5-subtitle-menu">{ $menuItems }</ul>
			</span>
		)
		return this.subTitleMenu
	}

	// generate subtitle tracks: <track >
	$getSubtitleTracks( subtitles ){
		if(!Array.isArray(subtitles)) return "";
		var $tracks = [];
		for(var ii=0;ii<subtitles.length;ii++){
			let track = subtitles[ii];
			$tracks.push(
				<track src={track.src} kind="subtitles" srcLang={track.lang} label={track.label} key={ii}/>
			)
		}
		return  $tracks
	}

	$getSource( sources ){
		if(!Array.isArray(sources)) return [];
		var $sources = [];
		for(var ii =0 ;ii<sources.length; ii++){
			let ss = sources[ii]
			let extName = path.extname( ss ).substr(1).split('?')[0];
			if (extName.length > 4) {
				extName = 'mp4';
			}
			$sources.push(
				<source src={ss} type={"video/"+extName} key={ii}/>
			)
		}
		return $sources;
	}

	render(){
		const { subtitles, loop, autoPlay, poster,preload, sources, controlPanelStyle, autoHideControls } = this.props
		//html5 video options
		var options = { loop, autoPlay, poster,preload };
		var wraperStyle = {}, contentWraperStyle = {};
		let $video = this.$video || {};
		$video.volume = this.props.volume;
		let vWidth =  this.props.width || $video.videoWidth || $video.clientWidth;
		let vHeight = this.props.height || $video.videoHeight || $video.clientHeight;
		options.width = vWidth
		options.height= vHeight
		wraperStyle.width = vWidth+"px";
		wraperStyle.height = contentWraperStyle.height = vHeight+"px";
		if(this.props.controlPanelStyle == "fixed" ) wraperStyle.height = (vHeight+50)+"px";

		var controlsClass = `r5-controls r5-controls--${controlPanelStyle} ${autoHideControls?"r5-auto-hide":""} `
		if(!this.props.controls) controlsClass = "r5-controls-hidden";


		return (
			<div className="r5-wraper" style={wraperStyle}>
				<video ref="video" {...options} >
					{  this.$getSource( sources) }
					{ subtitles && subtitles.length>0? this.$getSubtitleTracks(subtitles) : "" }
				</video>
				<div className="r5-overlay" onClick={this._togglePlay}>
					{!this.$video || this.$video.currentTime<=0? this.icons.playCircle:""}
				</div>
				<div className="r5-content" style={contentWraperStyle}>{this.props.children}</div>
				<div className={controlsClass}>
					<div className="r5-seekbar-wraper" ref="seekbarWraper">
						<div className="r5-seekbar-loaded" ref="seekbar" style={{width:this.state.loadedProgress+"%"}}></div>
						<div className="r5-seekbar" ref="loadedbar" style={{width:this.state.seekProgress+"%"}}></div>
						<input type="range" min="0.0" max="100.0" step="0.5"
							value={this.state.seekProgress}
							onChange={e=>this._setTime(e.target.value,true)} />
					</div>
					<div className="r5-panel">
						<button className="r5-play" onClick={this._togglePlay}>
							{ this.state.isPlaying ? this.icons.pause : this.icons.play }
						</button>
						<div className="r5-volume">
							<div className={ this.state.isMuted ? "volume-icon muted" : this.state.volume > .7 ? "volume-icon high" : "volume-icon medium" }></div>
							<div className="r5-volume-inner" style={{width:"71px"}}>
								<div className="r5-volume-bar" style={{width: (this.state.volume*100)+"%"}}></div>
								<input type="range" min="0" max="1" step="0.05" value={this.state.volume} onChange={e=>this._volume(e.target.value)}/>
							</div>
						</div>
						<div className="r5-timecode">
							<span className="current-time">{this.state.currentTime}</span>
							<span className="duration">{this.state.duration}</span>
						</div>
						<div className="r5-fullscreen" onClick={this._fullscreen}></div>
					</div>
				</div>
			</div>
		)
	}

	componentWillMount(){

		this.state = {
			isPlaying: this.props.autoPlay?true: false,
			isMuted: false,
			currentTime: "00:00",
			duration: "00:00",
			loadedProgress: 0,
			seekProgress: 0,// how much has played
			volume: this.props.volume,
			activeSubtitle:null,
			seekDisabled: this.props.seekDisabled?true: false,
		}

		// var fill = this.props.controlPanelStyle == "overlay"?"#ffffff":"#3FBA97";
		var fill = "#ffffff";
		this.icons = {}
		this.icons.play = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M8 5v14l11-7z" fill={fill}/>
		    <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.pause = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			 	<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.playCircle = (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill={fill}/>
			</svg>
		)
		this.icons.volumeUp=(
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.volumeDown=(
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" fill={fill}/>
			 	<path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.mute = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M7 9v6h4l5 5V4l-5 5H7z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.subtitles = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M0 0h24v24H0z" fill="none"/>
			    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" fill={fill}/>
			</svg>
		)
		this.icons.fullscreen = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M0 0h24v24H0z" fill="none"/>
			  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill={fill}/>
			</svg>
		)
	}

	componentWillUnmount(){
		if(this.seekbarUpdateTimer) clearInterval( this.seekbarUpdateTimer );
		var $video = this.$video;
		if ($video) {
			$video.removeEventListener("loadedmetadata", this._metaDataLoaded )
			$video.removeEventListener("ended", this._onEnded )
			$video.removeEventListener("volumechange", this._onVolumeChange )
			$video.removeEventListener("progress", this._progress )
			$video.pause();
			$video.src = ""; // Stops download.
			$video.load();
		}
	}

}

Video.propTypes = {
	// callbacks
	metaDataLoaded: 		PropTypes.func,// video's meta data loaded, return video element
	onEnded: 					  PropTypes.func,
	onVolumeChange: 		PropTypes.func,

	// properties
	sources: 						PropTypes.array,
	subtitles: 					PropTypes.array, // [{src:"foo.vtt", label:"English",srclan:"en" }]
	autoPlay: 					PropTypes.bool,
	controls: 					PropTypes.bool,
	autoHideControls: 	PropTypes.bool,
	controlPanelStyle: 	PropTypes.oneOf(["overlay","fixed"]), // overlay, fixed
	preload: 						PropTypes.oneOf(["auto","none","metadata"]),
	loop: 							PropTypes.bool,
	mute: 							PropTypes.bool,
	poster: 						PropTypes.string,
	width: 							PropTypes.string,
	height: 						PropTypes.string,
	volume: 						PropTypes.number,
	seekDisabled: 					PropTypes.bool,

	// overlayStyle: 			PropTypes.object,
}

Video.defaultProps = {
	autoPlay:  			false,
	loop: 					false,
	controls: 			true,
	autoHideControls:true,
	volume: 				1.0,
	mute: 					false,
	controlPanelStyle: "overlay",
	preload: 				"auto",
	seekDisabled: false,
}

export default Video

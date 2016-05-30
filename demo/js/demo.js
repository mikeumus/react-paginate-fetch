import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

window.React = React;

export class ImageList extends Component {
	render() {
		let imageNodes = this.props.data.map(function(image, index) {
			let modalTarget = `#imgModal-${image.id}`;
			let modalId = `imgModal-${image.id}`;
			return (
				<li key={index}>
					<img className="thumbnail-img" src={image.thumbnailUrl} alt={image.title} data-toggle="modal" data-target={modalTarget} />
					<div className="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby="imgModalLabel">
						<div className="modal-dialog" role="document">
							<div className="modal-content">
								<div className="modal-header">
									<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
									<h4 className="modal-title" id="imgModalLabel">{image.title}</h4>
								</div>
								<div className="modal-body">
									<img className="modal-img" src={image.url} alt={image.title} data-toggle="modal" data-target={modalTarget} />
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
									<button type="button" className="btn btn-primary">Save changes</button>
								</div>
							</div>
						</div>
					</div>
				</li>
			);
		});

		return (
			<div id="project-images" className="imagesList">
				<ul>
					{imageNodes}
				</ul>
			</div>
		);
	}
}

export class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			offset: 0
		};
	}

	loadCommentsFromServer() {
		$.ajax({
			url      : this.props.url,
			data     : {limit: this.props.perPage, offset: this.state.offset},
			dataType : 'json',
			type     : 'GET',

			success: data => {
				this.setState({data: data.photos, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)}); //data.length
			},

			error: (xhr, status, err) => {
				console.error(this.props.url, status, err.toString());
			}
		});
	}

	componentDidMount() {
		this.loadCommentsFromServer();
	}

	handlePageClick = (data) => {
		let selected = data.selected;
		let offset = Math.ceil(selected * this.props.perPage);

		this.setState({offset: offset}, () => {
			this.loadCommentsFromServer();
		});
	};

	render() {
		return (
			<div className="imagesBox">
				<ImageList data={this.state.data} />
				<ReactPaginate previousLabel={"previous"}
											 nextLabel={"next"}
											 breakLabel={<a href="">...</a>}
											 pageNum={this.state.pageNum}
											 marginPagesDisplayed={2}
											 pageRangeDisplayed={5}
											 clickCallback={this.handlePageClick}
											 containerClassName={"pagination"}
											 subContainerClassName={"pages pagination"}
											 activeClassName={"active"} />
			</div>
		);
	}
}

ReactDOM.render(
	<App url={'http://react-paginate-fetch-mikeumus.c9users.io/photos'} 
			 perPage={10} />,
	document.getElementById('react-paginate')
);

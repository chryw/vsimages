import * as React from 'react';
import { TextField, List } from 'office-ui-fabric-react/lib/index';
import * as axios from 'axios';
import GalleryItem from './GalleryItem.jsx';

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;

export default class Gallery extends React.Component {
  constructor() {
    super();
    this.positions = {};
    this.getItemCountForPage = this.getItemCountForPage.bind(this);
    this.getPageHeight = this.getPageHeight.bind(this);
    this.state = {
      items: [],
      filteredItems: [],
      total: 0,
      pairedItems: [],
    };

    this.filterResult = (query) => {
      let filteredItems = this.state.items;
      let pairedItems = this.state.pairedItems;

      filteredItems = query ?
      filteredItems.filter(item => `${item.title.toLowerCase()} ${item.keywords.join(' ').toLowerCase()}`.indexOf(query.toLowerCase()) >= 0) :
      filteredItems;

      pairedItems = this.pairResult(filteredItems);
      this.setState({
        filteredItems,
        pairedItems,
      });
    };

    this.pairResult = (data) => {
      let pairs = [];
      for (let i = 0; i < data.length; i += 2) {
        if (data[i + 1]) {
          pairs.push([data[i], data[i + 1]]);
        } else {
          pairs.push([data[i]]);
        }
      }
      return pairs;
    };
  }

  componentWillMount() {
    // get data
    axios.get(this.props.dataurl)
      .then((response) => {
        const items = response.data.filter(item => item.publish === 1);
        const filteredItems = items;
        const total = items.length;
        const pairedItems = this.pairResult(items);

        // set state
        this.setState({
          items,
          filteredItems,
          total,
          pairedItems,
        });
      });
  }

  getItemCountForPage(itemIndex, surfaceRect) {
    if (itemIndex === 0) {
      this.columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this.columnWidth = Math.floor(surfaceRect.width / this.columnCount);
      this.rowHeight = this.columnWidth;
    }

    return this.columnCount * ROWS_PER_PAGE;
  }

  getPageHeight() {
    return this.rowHeight * ROWS_PER_PAGE;
  }

  render() {
    // search result count
    const resultCountText = (this.state.filteredItems.length === this.state.items.length) ? '' : ` ${this.state.filteredItems.length} of ${this.state.items.length} shown`;

    return (
      <div className="gallery">
        <div className="anchor" id="aGallery" />
        <h3>Gallery</h3>
        <div className="search">
          <TextField
            label={`Filter by title ${resultCountText}`}
            onBeforeChange={this.filterResult}
          />
        </div>
        <List
          className="gallery-body"
          items={this.state.pairedItems}
          renderedWindowsAhead={4}
          onRenderCell={(item) => {
            let content = undefined;
            if (item.length === 2) {
              content = (
                <div className="gallery-row">
                  <GalleryItem
                    id={item[0].id}
                    title={item[0].title}
                    description={item[0].description}
                  />
                  <GalleryItem
                    id={item[1].id}
                    title={item[1].title}
                    description={item[1].description}
                  />
                </div>
              );
            } else {
              content = (
                <div className="gallery-row">
                  <GalleryItem
                    id={item[0].id}
                    title={item[0].title}
                    description={item[0].description}
                  />
                </div>
              );
            }
            return content;
          }}
        />
      </div>
    );
  }
}

Gallery.propTypes = {
  dataurl: React.PropTypes.string.isRequired,
  limit: React.PropTypes.number,
};

Gallery.defaultProps = {
  limit: 0,
};

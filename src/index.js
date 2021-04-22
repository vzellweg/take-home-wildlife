import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            definition_displayed: false
        }
    }

    imgClick() { this.setState({definition_displayed: !this.state.definition_displayed})} 

    render() {
        const species_data = this.props.species_data;
        const header = this.props.species_data_header;
        return (    
            <div className="card">
                <div className={`img-container ${this.state.definition_displayed ? 'closed': ''}`}>
                    <img className={`responsive`} src={this.props.imageURL} onClick={() => {this.imgClick()}}
                        alt="species picture"/><div className="img-attrib">{species_data[header['credit']]}</div>
                </div>
             <Definition open={this.state.definition_displayed ? 'open' : false}
                name={species_data[header['name']]}
                class={species_data[header['class']]}
                order={species_data[header['order']]}
                family={species_data[header['family']]}
                genus={species_data[header['genus']]}
                species={species_data[header['species']]}
                credit={species_data[header['credit']]}
                feeding={species_data[header['feeding']]}
                habitat={species_data[header['habitat']]}
                description={species_data[header['description']]}
                skull={species_data[header['skull']]}
                onClick={()=>{this.imgClick()}}
                ></Definition>
             </div>
        );
    }
}

class Definition extends React.Component {
    render() {
        return (
        <div className={`speciesInfo responsive ${!this.props.open ? 'closed': ''}`}  onClick={this.props.onClick}>
            <div className="row"><div className="dataTitle">Class: </div><div className="value">{this.props.class}</div></div>
            <div className="row"><div className="dataTitle">Order: </div><div className="value">{this.props.order}</div></div>
            <div className="row"><div className="dataTitle">Family: </div><div className="value">{this.props.family}</div></div>
            <div className="row"><div className="dataTitle">Genus: </div><div className="value">{this.props.genus}</div></div>
            <div className="row"><div className="dataTitle">Species: </div><div className="value">{this.props.species}</div></div>
            <div className="row"><div className="dataTitle">Common Name: </div><div className="value">{this.props.name}</div></div>
        </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        species_data_table: [],
        species_data_header: {}, //map of header name to col index
        index: 0,
        error: null,
        isLoaded: false
      };
      this.getData = this.getData.bind(this);
    //   this.handleClick
    }
    componentDidMount() {
       this.getCsvData();
    }

    fetchCsv() {
        return fetch('http://take-home-wildlife.s3-website-us-west-2.amazonaws.com/data.csv')
            .then(function (response) {
                let reader = response.body.getReader();
                let decoder = new TextDecoder('utf-8');

                return reader.read().then(
                    (result) => { return decoder.decode(result.value) }
                );
            });
            // Handle Errors?
    }

    getData(result) {
        const headers = {};
        const lines = result.split(/\r\n|\n/);
        const table = lines.map((line) => {return line.split(',')});
        const blank_indexes = [];
        const header_len = table[0].length;
        
        // remove header line and create header map
        table.shift().forEach((e, i) => {headers[e] = i;})
        this.setState({species_data_header: headers});

        // randomize data 
        table.forEach((v, i) => {
            const j = Math.floor(Math.random() * (i + 1));
            [table[i], table[j]] = [table[j], table[i]];
            if (table[j].length < header_len) {
                blank_indexes.push(j);
            }
        });
        // remove blank lines
        blank_indexes.forEach((i) => { table.splice(i,1)});
        
        this.setState({species_data_table: table});
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();

        this.getData(csvData);
    }

    openNextCard() {
        this.setState({
            index: (this.state.index + 1) % this.state.species_data_table.length
        });
    }
    openPreviousCard() {
        // const newIndex = this.state.index - 1;
        this.setState({
            index: this.state.index - 1 < 0 ? this.state.species_data_table.length - 1 : this.state.index - 1
        });
    }
    render() {
        const index = this.state.index;
        const species_data_table = this.state.species_data_table;
        const species_row = species_data_table[index];
        const header = this.state.species_data_header;
        if (!species_data_table.length) { return null; }
        return (
            <div className="app">
                <h2 className="title">Click Flash Card to show the other side</h2>
                <div className="btnContainer">
                    <button className="nextBtn" onClick={() => {this.openPreviousCard()}}>
                        Previous Card
                    </button>
                    <button className="nextBtn" onClick={() => {this.openNextCard()}}>
                        Next Card
                    </button>
                </div>
                <Card imageURL={species_row[header['image']]}
                    species_data={species_row}
                    species_data_header={header}
                    ></Card>
                
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));

module.hot.accept();

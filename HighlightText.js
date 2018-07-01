/**
 * Created by wangzhen on 2018/6/25.
 */
import React, {Component} from 'react';
import {
    Text,
} from 'react-native';

export default class HighlightText extends Component {


    constructor(props) {
        super(props);
        this._getPieces = this._getPieces.bind(this);
        this._getPieceTexts=this._getPieceTexts.bind(this)
        this._getText = this._getText.bind(this)
        this._append = this._append.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.textToHighlight != this.props.textToHighlight
        && JSON.stringify(nextProps.searchKeys) != JSON.stringify(this.props.searchKeys);
    }


    _getPieces(textToHighlight, keys = []) {

        let re = new RegExp(keys.join('|'), this.props.caseSensitive ? 'g' : 'gi');
        let match;
        let pieces = [];
        let result =[];
        while ((match = re.exec(textToHighlight))) {
            let start = match.index;
            let end = re.lastIndex;
            pieces.push({
                start: start,
                end: end,
            });
        }

        let totalLength = textToHighlight.length;

        if (pieces.length === 0) {
            this._append(0, totalLength, false, result);
        } else {
            let lastIndex = 0;
            pieces.forEach((piece) => {
                this._append(lastIndex, piece.start, false, result);
                this._append(piece.start, piece.end, true, result);
                lastIndex = piece.end;
            } );
            this._append(lastIndex, totalLength, false, result);
        }

        // console.log('result：' + JSON.stringify(result));
        return result;
    }

    _append(start, end, highlight, result) {
        if (end - start > 0) {
            result.push({
                start: start,
                end: end,
                highlight: highlight
            });
        }
    }


    _getText(text) {
        return <Text style={this.props.highlightStyle}
                     numberOfLines={1}>{text}</Text>
    }


    _getPieceTexts(textToHighlight, keys) {
        let pieces = this._getPieces(textToHighlight, keys);

        return pieces.map(piece => {
            let text = textToHighlight.substring(piece.start, piece.end);
            return piece.highlight ?  this._getText(text) : text;

        });

    }


    render() {
        if (!this.props.textToHighlight) return null;
        let type = Object.prototype.toString.call(this.props.textToHighlight);
        //textToHighlight must be string
        if(type == 'string' || type == '[object String]'){
            if (this.props.searchKeys && this.props.searchKeys.length > 0) {

                let searchKeys = this.props.searchKeys;

                searchKeys.sort((k1,k2) => k2.length - k1.length);
                return <Text style={this.props.contentStyle}
                             numberOfLines={1}>
                    {this._getPieceTexts(this.props.textToHighlight, searchKeys)}
                </Text>
            } else {

                return <Text style={this.props.contentStyle}
                             numberOfLines={1}>
                    {this.props.textToHighlight}
                </Text>

            }
        }else{
            return null;
        }
    }

}

HighlightText.defaultProps = {
    caseSensitive: true,
    contentStyle: {
        fontSize: 15,
        color: 'black'
    },
    highlightStyle:{
        fontSize:15,
        color:'blue'
    },
    searchKeys:[],
    textToHighlight:''
}
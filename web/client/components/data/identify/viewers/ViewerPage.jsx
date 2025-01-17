import PropTypes from "prop-types";

import Button from "../../../misc/Button";
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

export default class extends React.Component {
    static propTypes = {
        format: PropTypes.string,
        viewers: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        response: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.node,
        ]),
        layer: PropTypes.object,
    };

    onTouchStart = (event) => {
        const touch = event.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.setState({ scrolling: false });
    };

    onTouchMove = (event) => {
        const touch = event.touches[0];
        const div = event.currentTarget;
        if (this.state.scrolling) {
            event.stopPropagation();
            return;
        }
        // identify direction
        if (
            Math.abs(this.startY - touch.pageY) >
            Math.abs(this.startX - touch.pageX)
        ) {
            // vertical scrolling
            event.stopPropagation();
            return;
        }
        // > 0 left, < 0
        const dir = this.startX < touch.pageX ? "left" : "right";

        if (
            div &&
            dir === "left" &&
            div.clientWidth < div.scrollWidth &&
            div.scrollLeft !== 0
        ) {
            // left border not reached
            this.setState({ scrolling: true });
            event.stopPropagation();
        } else if (
            div &&
            dir === "right" &&
            div.clientWidth + div.scrollLeft !== div.scrollWidth
        ) {
            // right border not reached
            this.setState({ scrolling: true });
            event.stopPropagation();
        }
    };

    onTouchEnd = () => {
        this.setState({ scrolling: false });
    };

    renderPage = () => {
        const Viewer =
            typeof this.props.viewers === "function"
                ? this.props.viewers
                : this.props.viewers[this.props.format];
        if (Viewer) {
            return (
                <Viewer
                    response={this.props.response}
                    layer={this.props.layer}
                />
            );
        }
        return null;
    };

    render() {
        return (
            <div
                style={{ width: "100%", height: "100%", overflowX: "auto" }}
                onTouchMove={this.onTouchMove}
                onTouchStart={this.onTouchStart}
                onTouchEnd={this.onTouchEnd}
            >
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <label>
                        Ваша электронная почта
                        <input />
                    </label>
                    <Button
                        onClick={() => {
                            let features = this.props.response.features;
                            var data = features[0].properties;
                            fetch("http://localhost:3000/sendMail", {
                                method: "POST",
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-type":
                                        "application/json; charset=UTF-8",
                                },
                            });
                        }}
                    >
                        Отправить данные на почту
                    </Button>
                </div>
                {this.renderPage()}
            </div>
        );
    }
}

import Inferno from 'inferno';
import Component from 'inferno-component';
import logo from './logo.svg';
import './App.css';
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

import Pythagoras from './Pythagoras';


// borrowed from Vue fork https://github.com/yyx990803/vue-fractal/blob/master/src/App.vue
function throttleWithRAF (fn) {
  let running = false
  return function () {
    if (running) return
    running = true
    window.requestAnimationFrame(() => {
      fn.apply(this, arguments)
      running = false
    })
  }
}

class App extends Component {
    svg = {
        width: 1280,
        height: 600
    };
    state = {
        currentMax: 0,
        baseW: 80,
        heightFactor: 0,
        lean: 0
    };
    running = false;
    realMax = 11;
    svgElement = null;

    // Throttling approach borrowed from Vue fork
    // https://github.com/yyx990803/vue-fractal/blob/master/src/App.vue
    // rAF makes it slower than just throttling on React update
    onMouseMove = (event) => {
        if (this.running) return;
        this.running = true;

        const [x, y] = d3mouse(this.svgElement),

              scaleFactor = scaleLinear().domain([this.svg.height, 0])
                                         .range([0, .8]),

              scaleLean = scaleLinear().domain([0, this.svg.width/2, this.svg.width])
                                       .range([.5, 0, -.5]);

        console.time('fast')
        this.setState({
            heightFactor: scaleFactor(y),
            lean: scaleLean(x)
        });
        console.timeEnd('fast')
        this.running = false;
    }

    svgElemeRef = (domNode) => {
        this.svgElement = domNode;
    }

    componentDidMount() {
        d3select(this.svgElement).on("mousemove", this.onMouseMove);

        this.next();
    }

    next() {
        const { currentMax } = this.state;

        if (currentMax < this.realMax) {
            this.setState({currentMax: currentMax + 1});
            setTimeout(this.next.bind(this), 500);
        }
    }    

    render() {
        return (
            <div className="App" noNormalize>
                <p className="App-intro">
                    <svg width={this.svg.width} height={this.svg.height} ref={this.svgElemeRef }
                         style={{border: "1px solid lightgray"}}>

                        <Pythagoras w={this.state.baseW}
                                    h={this.state.baseW}
                                    heightFactor={this.state.heightFactor}
                                    lean={this.state.lean}
                                    x={this.svg.width/2-40}
                                    y={this.svg.height-this.state.baseW}
                                    lvl={0}
                                    maxlvl={this.state.currentMax}
                                    noNormalize
                                    />
                    </svg>
                </p>
            </div>
        );
    }
}

export default App;

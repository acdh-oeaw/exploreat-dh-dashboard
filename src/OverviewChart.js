import React, { Component } from 'react';
import * as d3 from 'd3'
import Select from 'react-select'



const options = [
	{ value: 'gender', label: 'Gender' },
	{ value: 'author', label: 'Author' },
]

const optionsMap = {
	'gender' : 'gender',
	'author' : 'fullName'
}

const xOffset = 150

class OverviewChart extends Component {

	constructor(props){
    	super(props)

    	this.state = {
    		selectedOption: options[0],
    		xAxis: d3.axisBottom(),
    		xScale: d3.scalePoint(),
    		forceX: d3.forceX(),
    		forceY: d3.forceY(),
    		simulation: d3.forceSimulation()
    	}

    	this.createOverviewChart = this.createOverviewChart.bind(this)
    	this.updateChart = this.updateChart.bind(this)
    	this.handleChange = this.handleChange.bind(this)
  	}

  	handleChange(selectedOption) {
  		console.log('handleChange')
  		this.setState({ selectedOption })
  		console.log(`Option selected:`, selectedOption);
  	}

	componentDidMount() {
    	this.createOverviewChart()
  	}

  	componentDidUpdate() {
  		console.log('componentDidUpdate')
  		this.updateChart()
  	}


  	updateConfig() {
  		console.log('updateConfig')
  		const { data, size } = this.props
  		const { selectedOption } = this.state

  		

		this.state.xScale
				.domain(d3.map(data, d => d[optionsMap[selectedOption.value]]).keys())
				.range([xOffset, size[0] - xOffset])

		this.state.xAxis.scale(this.state.xScale)
		
		this.state.forceX.x((d) => this.state.xScale(d[optionsMap[selectedOption.value]]))
		this.state.forceY.y((d) => size[1] / 2)
		
  	}

  	createOverviewChart() {
  		console.log('createOverviewChart')
  		if (this.props.data.length == 0) return 

  		this.updateConfig()
  		const { data, size } = this.props
  		
  		const node = d3.select(this.node)
  		

		const radiusScale = d3.scaleLinear()
						.domain(d3.extent(data, d => parseInt(d.nQuestion)))
						.range([4, 15])

		d3.select('#idns')
			.on('change', () => {
				const element = document.getElementById('inds')
				const cluster = element.options[sect.selectedIndex].value
				console.log(cluster)
			})


		const namesSet = new Set(data.map(d => d.fullName))
		console.log(namesSet);

		const circles = node.append('g')
						// .attr('transform', `translate(${xOffset}, 0)`)
						.attr('class', 'circles')
						.selectAll('circle')
						.data(data)
						.enter().append("circle")
						.attr("r", d=> radiusScale(parseInt(d.nQuestion)))
						.attr("fill", d => d.gender == "Female" ? "red" : "blue")

		node.append('g').attr('transform', `translate(0, ${size[1] - 50})`).attr('id', 'xAxisG').call(this.state.xAxis)



		this.state.simulation
						.velocityDecay(0.3)
						.force('x', this.state.forceX)
						.force('y', this.state.forceY)
						.force('collide', d3.forceCollide(15))

		this.state.simulation.nodes(data)
			.on('tick', function() {
				circles
					.attr('transform', d => {
						return `translate(${d.x}, ${d.y})`
					})
		})
    	
  	}


  	updateChart() {
  		this.updateConfig()
  		const t = d3.transition().duration(500)
  		d3.select(this.node).select("#xAxisG").transition(t).call(this.state.xAxis)

  		this.state.simulation
  				.force('x', this.state.forceX)
				.force('y', this.state.forceY)
		this.state.simulation.alpha(1).restart()
  	
  	}

	render() {
		console.log('render')
		let { selectedOption } = this.state 

		return (
		<div>
			<svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
			</svg>
			<Select
				id='idns'
				value={selectedOption}
				onChange={this.handleChange}
				options={options}
			/>
		</div>)

	}
}


export default OverviewChart

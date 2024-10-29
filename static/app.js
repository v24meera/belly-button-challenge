// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metaArray = metadata.filter(sampleID => sampleID.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let divSample = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    divSample.html("");

    // Inside loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metaArray[0]).forEach(([key,value]) => {
      divSample.append("h5").text(`${key.toUpperCase()}: ${value}`);
  });
})};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleArray = sampleData.filter(sampleID => sampleID.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleArray[0].otu_ids;
    let otu_labels = sampleArray[0].otu_labels;
    let sample_values = sampleArray[0].sample_values;

    // Build a Bubble Chart
    let bubbles = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
    }
    };

    let bubbling = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'},
      hovermode: 'closest',
      height: 600,
      width: 1000
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbles], bubbling);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    let xticks = sample_values.slice(0,10).reverse();
    let labels = otu_labels.slice(0,10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barred = {
      x: xticks,
      y: yticks,
      text: otu_labels,
      type: 'bar',
      orientation: 'h'
    };

    let barring = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: 'Number of Bacteria'},
      yaxis: {title: 'OTU ID'}
    };
        

    // Render the Bar Chart
    Plotly.newPlot("bar", [barred], barring);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    let divSelect = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      divSelect.append("option").text(name).property("value", name);
      });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

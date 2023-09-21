const tf = require('@tensorflow/tfjs');
const tfn = require('@tensorflow/tfjs-node');

const handler = tfn.io.fileSystem('./data/model.json');
// const fs = require('fs');

const use = require('@tensorflow-models/universal-sentence-encoder');
const backend = require('./data/backend.json');
const frontend = require('./data/frontend.json');
const design = require('./data/design.json');
const docs = require('./data/docs.json');
const database = require('./data/database.json');
const security = require('./data/security.json');
const tester = require('./data/tester.json');

const step = backend.concat(frontend);
const stepTwo = step.concat(design);
const stepTree = stepTwo.concat(docs);
const stepFour = stepTree.concat(database);
const stepFive = stepFour.concat(security);
const trainTasks = stepFive.concat(tester);

const N_CLASSES = 7;

const encodeData = async (encoder, tasks) => {
  const sentences = tasks.map((t) => {
    return t.text.toLowerCase();
  });
  const embeddings = await encoder.embed(sentences);
  return embeddings;
};

async function trainMode(encoder) {
  const xTrain = await encodeData(encoder, trainTasks);

  const yTrain = tf.tensor2d(
    trainTasks.map((t) => {
      return [
        t.position === 'front-end' ? 1 : 0,
        t.position === 'back-end' ? 1 : 0,
        t.position === 'design' ? 1 : 0,
        t.position === 'database' ? 1 : 0,
        t.position === 'IT security' ? 1 : 0,
        t.position === 'tester' ? 1 : 0,
        t.position === 'documentation' ? 1 : 0,
      ];
    })
  );
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [xTrain.shape[1]],
      activation: 'softmax',
      units: N_CLASSES,
    })
  );

  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(0.001),
    metrics: ['accuracy'],
  });

  await model.fit(xTrain, yTrain, {
    batchSize: 4,
    validationSplit: 0.1,
    shuffle: true,
    epochs: 250,
  });

  await model.save('file://./data');

  return model;
}

const suggestIcon = async (model, encoder, taskName) => {
  if (!taskName.trim().includes(' ')) {
    return null;
  }
  const xPredict = await encodeData(encoder, [{ text: taskName }]);

  const prediction = await model.predict(xPredict).dataSync();

  const maxValue = Math.max(...prediction);
  const value = prediction.indexOf(maxValue);

  if (value === 0) {
    return 'front-end';
  }
  if (value === 1) {
    return 'back-end';
  }
  if (value === 2) {
    return 'design';
  }
  if (value === 3) {
    return 'database';
  }
  if (value === 4) {
    return 'IT security';
  }
  if (value === 5) {
    return 'tester';
  }
  if (value === 6) {
    return 'documentation';
  }
  return null;
};

const predictionProcess = async () => {
  const CONFIDENCE_THRESHOLD = 0.65;
  const sentenceEncoder = await use.load();
  const trainedModel = await trainMode(sentenceEncoder);
  const loadedModel = await tf.loadLayersModel(handler);

  console.log(trainedModel);
  const prediction = await suggestIcon(
    loadedModel,
    sentenceEncoder,
    'create new unit test for jobs',
    CONFIDENCE_THRESHOLD
  );
  return prediction;
};

predictionProcess();

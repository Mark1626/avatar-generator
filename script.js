"use strict";
const TWO_PI = 360;
const width = 500;
const height = 500;

const types = ["wave", "wave", "circle", "square"];

const sin = (angle) => Math.sin((Math.PI * angle) / 180);
const cos = (angle) => Math.cos((Math.PI * angle) / 180);
const random = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(random(a, b));
const randElem = (arr) => arr[randi(0, arr.length)];

const style = {
  square: (ctx, { color, radius }) => {
    const region = new Path2D();
    region.rect(-radius, -radius, 2 * radius, 2 * radius);
    region.closePath();

    ctx.fillStyle = color;
    ctx.fill(region);
  },
  circle: (ctx, { color, radius }) => {
    const region = new Path2D();
    region.ellipse(0, 0, radius, radius, 0, 0, 2 * Math.PI);
    region.closePath();

    ctx.fillStyle = color;
    ctx.fill(region);
  },
  wave: (ctx, { color, radius, args }) => {
    const region = new Path2D();
    radius = Math.abs(radius);
    const angleStep = TWO_PI / 140;

    region.moveTo(radius * cos(0.0), radius * sin(0.0));
    for (var angle = 0.0; angle < TWO_PI; angle += angleStep) {
      var rad = radius + args[0] * sin(angle * args[1]);

      region.lineTo(rad * cos(angle), rad * sin(angle));
    }

    region.lineTo(radius * cos(0.0), radius * sin(0.0));
    region.closePath();

    ctx.fillStyle = color;
    ctx.fill(region);
  },
};

const generateAvatar = (ctx, types) => {
  const layer = [];

  for (let radius = 0.0; radius <= 1.0; radius += random(0.1, 0.2)) {
    var color = `rgb(${randi(0, 255)},${randi(0, 255)},${randi(0, 255)})`;
    var args = [random(0, 0.07), randi(5, 20)];

    layer.unshift({
      radius,
      color,
      type: randElem(types),
      args,
    });
  }

  return layer;
};

const draw = (types) => {
  const canvas = document.querySelector("canvas");
  canvas.height = height;
  canvas.width = width;
  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = 1;
  const avatar = generateAvatar(ctx, types);
  const scale = 250;
  ctx.translate(250, 250);
  ctx.scale(scale, scale);

  avatar.forEach((layer) => {
    style[layer.type](ctx, layer);
  });
};

const exportPng = () => {
  const canvas = document.querySelector("canvas");
  const link = document.createElement("a");
  link.setAttribute("download", "avatar.png");
  link.setAttribute(
    "href",
    canvas
      .toDataURL("image/png")
      .replace("image/png", "application/octet-stream")
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

draw(types);
document.getElementById("regen").onclick = () => draw(types);
document.getElementById("download").onclick = exportPng;

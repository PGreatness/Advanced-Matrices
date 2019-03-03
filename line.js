/**
 * Ahnaf Hasan
 * MKS66 - Computer Graphics
 * Because it's time, you'll make a line
 * 2/9/2018
 */

const fs = require('fs')

//   CHECKS FOR INSTALLED DEPENDENCIES
const exec = require('child_process').execSync
var cmd = "npm ls colors"
var errs = ""
var e = false
try {
    exec(cmd)
} catch (error) {
    e = true
    errs += "color\n"
}
if (e) {
    console.log(`There are missing dependencies! Please have the following installed to continue:\n${errs}\n
    Run "make install" to install packages`.trim())
    process.exit(1)
}
var color = require('colors')
var grid = []

/**
 * Clears the grid and creates a new one
 * @param {*} size an int
 */
function clear_screen(size) {
    grid = []
    for (i = 0; i < size; i++) {
        var row = []
        for (w = 0; w < size; w++) {
            row.push("0 0 0")
        }
        grid.push(row)
    }
}

/**
 * Plots the point on the grid. Color is prechosen
 * @param {*} x x value of point (int)
 * @param {*} y y value of point (int)
 * @param {*} color color code for point (String)
 */
function plot(x, y, color) {
    let size = grid.length - 1
    if (color.toLowerCase() == "green") {
        grid[size - y][x] = "0 255 0"
        return true
    }
    if (color.toLowerCase() == "red") {
        grid[size - y][x] = "255 0 0"
        return true
    }
    if (color.toLowerCase() == "blue") {
        grid[size - y][x] = "0 0 255"
        return true
    }
    if (color.toLowerCase() == "aqua") {
        grid[size - y][x] = "132 220 198"
        return true
    }
    return false
}

/**
 * Graphs the line connecting the points (x0, y0) and (x1, y1). 
 * **Works for octant 1**
 * @param {Number} x0 x coordinate of first point (int)
 * @param {Number} y0 y coordinate of first point (int)
 * @param {Number} x1 x coordinate of second point (int)
 * @param {Number} y1 y coordinate of second point (int)
 */
function octant_1(x0, y0, x1, y1) {
    var x = x0
    var y = y0
    var A = y1 - y0
    var B = -(x1 - x0)
    var d = 2*A + B
    while(x <= x1) {
        // console.log(`x:${x}\ty:${y}\td:${d}`)
        plot(x, y, "red")
        if (d > 0) {
            y++
            d += 2*B
        }
        x++
        d += 2*A
    }
    console.log("Octant 1 has been plotted (red)".red)
    return true
}

/**
 * Graphs the line connecting the points (x0, y0) and (x1, y1). 
 * **Works for octant 2**
 * @param {Number} x0 x coordinate of first point (int)
 * @param {Number} y0 y coordinate of first point (int)
 * @param {Number} x1 x coordinate of second point (int)
 * @param {Number} y1 y coordinate of second point (int)
 */
function octant_2(x0, y0, x1, y1) {
    var x = x0
    var y = y0
    var A = y1 - y0
    var B = -(x1 - x0)
    var d = 2*A + B
    while(y <= y1) {
        // console.log(`x:${x}\ty:${y}\td:${d}`)
        plot(x, y, "green")
        if (d < 0) {
            x++
            d += 2*A
        }
        y++
        d += 2*B
    }
    console.log("Octant 2 has been plotted (green)".green)
    return true
}

/**
 * Graphs the line connecting the points (x0, y0) and (x1, y1). 
 * **Works for octant 3**
 * @param {Number} x0 x coordinate of first point (int)
 * @param {Number} y0 y coordinate of first point (int)
 * @param {Number} x1 x coordinate of second point (int)
 * @param {Number} y1 y coordinate of second point (int)
 */
function octant_3(x0, y0, x1, y1) {
    var x = x0
    var y = y0
    var A = y1 - y0
    var B = -(x1 - x0)
    var d = 2*A + B
    while(y >= y1) {
        // console.log(`x:${x}\ty:${y}\td:${d}\tA:${A}\tB:${B}`)
        plot(x, y, "blue")
        if (d < 0) {
            x++
            d -= 2*A
        }
        y--
        d += 2*B
    }
    console.log("Octant 3 has been plotted (blue)".blue)
    return true
}

/**
 * Graphs the line connecting the points (x0, y0) and (x1, y1). 
 * **Works for octant 4**
 * @param {Number} x0 x coordinate of first point (int)
 * @param {Number} y0 y coordinate of first point (int)
 * @param {Number} x1 x coordinate of second point (int)
 * @param {Number} y1 y coordinate of second point (int)
 */
function octant_4(x0, y0, x1, y1) {
    // console.log(`WARNING WARNING WARNING WARNING WARNING\nx1:${x1}\tx:${x0}`)
    var x = x0
    var y = y0
    var A = y1 - y0
    var B = -(x1 - x0)
    var d = 2*A + B
    while(x <= x1) {
        // console.log(`x:${x}\ty:${y}\td:${d}\tA:${A}\tB:${B}`)
        plot(x, y, "aqua")
        if (d < 0) {
            y--
            d -= 2*B
        }
        x++
        d += 2*A
    }
    console.log("Octant 4 has been plotted (cyan)".cyan)
    return true
}

/**
 * Graphs line using helper functions
 * @param {Number} x0 x coordinate of first point (int)
 * @param {Number} y0 y coordinate of first point (int)
 * @param {Number} x1 x coordinate of second point (int)
 * @param {Number} y1 y coordinate of second point (int)
 */
function make_line(x0, y0, x1, y1) {
    if (x1 < x0) {
        return make_line(x1, y1, x0, y0)
    }
    var A = y1 - y0
    var B = -(x1 - x0)
    // console.log(`A:${A}\tB:${B}\t-A/B:${-A/B}`)
    var slope = -A/B
    if (slope >= 0 && slope <= 1) { // 0 <= slope <= 1
        return octant_1(x0, y0, x1, y1)
    }
    if (slope > 1) {               // slope > 1
        return octant_2(x0, y0, x1, y1)
    }
    if (slope < -1) {              // large negative slope
        return octant_3(x0, y0, x1, y1)
    }
    if (slope >= -1 && slope < 0) { // -1 <= slope < 0
        return octant_4(x0, y0, x1, y1)
    }
    // code for other octants
}

console.log("Colors correspond to the lines drawn")
clear_screen(500) // makes and clears the current grid

// make_line(0, 100, 400, 300)  // Octant 1
// make_line(0, 150, 100, 499)  // Octant 2
// make_line(0, 150, 10, 100)   // Octant 3
// make_line(0, 250, 100, 200) // Octant 4

// for (i = 0; i < 250; i++) {
//     make_line(
//         Math.ceil((Math.random()) * (grid.length - 1)), 
//         Math.ceil((Math.random()) * (grid.length - 1)), 
//         Math.ceil((Math.random()) * (grid.length - 1) % 100), 
//         Math.ceil((Math.random()) * (grid.length - 1) % 100)
//     )
// }

// for (i =0; i < 250; i++) {
//     make_line(
//         i, (i * 2) % grid.length, (i * 3) % grid.length, (i * 4) % grid.length
//     )
//     make_line(
//         (i * 4) % grid.length, (i * 3) % grid.length, (i * 2) % grid.length, i
//     )
// }
// for (i =250; i >= 0; i--) {
//     make_line(
//         Math.ceil((i / 4)) % grid.length, Math.ceil((i / 2)) % grid.length, Math.ceil((i / 3)) % grid.length, i
//     )
// }

function imageWrite() {
    fs.writeFileSync('image.ppm', `P3\n${grid.length} ${grid.length}\n255\n\n`) // write header
    for(i = 0; i < grid.length; i++) {
        var string = grid[i].toString().split(',').join(' ')
        fs.appendFileSync('image.ppm', `${string}\n`)
    }
}

imageWrite()

module.exports = {
    makeLine : make_line,
    imgWrite : imageWrite,
    clear : clear_screen
}
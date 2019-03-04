const fs = require('fs')
var lineMaker = require('./line')
var spawn = require('child_process').execSync
class Matrix {
    /**
     * Creates a Matrix using the given sizes.
     * @param {Number} size_x number of rows in Matrix. Defaults to 4
     * @param {Number} size_y number of columns in Matrix Defaults to 4
     */
    constructor(size_x, size_y) {
        if (!(Number.isInteger(size_x) || Number.isInteger(size_y))) {
            throw new Error("sizes must be integers")
        }
        if (size_x <= 3 || size_y <= 3) {
            throw new Error("sizes should not be less than or equal to 3")
        }
        if (size_x == undefined) {
            this.rows = 4
        }else{
            this.rows = size_x
        }
        if (size_y == undefined) {
            this.cols = 4
        }else{
            this.cols = size_y
        }
        this.arr = []
        for (var i = 0; i < this.rows; i++) {
            var push = new Array(this.cols)
            for (var w = 0; w < this.cols; w++) {
                push[w] = NaN
            }
            this.arr.push(push)
        }
    }

    /**
     * Creates a string representation of the Matrix
     * @returns {String} a string
     */
    toString() {
        var arr = this.arr
        var str = ""
        for (var i =0; i < arr.length; i++) {
            var line = "| "
            for (var w = 0; w < arr[0].length; w++) {
                line += `${arr[i][w]} `
            }
            line += "|\n"
            str += line
        }
        return str
    }

    /**
     * Adds the point (x,y,z) to the Matrix
     * @param {Number} point_x an integer value for the x-coordinate of a point
     * @param {Number} point_y an integer value for the y-coordinate of a point
     * @param {Number} point_z an integer value for the z-coordinate of a point
     * @returns true if success
     * @throws Error if not enough space in Matrix
     */
    addPoint(point_x, point_y, point_z) {
        var arr = this.arr
        for (var i = 0; i < arr[0].length; i++) {
            // console.log(i)
            if (isNaN(arr[0][i])) {
                arr[0][i] = point_x
                arr[1][i] = point_y
                arr[2][i] = point_z
                arr[3][i] = 1
                this.arr = arr
                return true
            }
        }
        throw new Error("Not enough space in matrix")
    }

    /**
     * Adds an edge to the matrix
     * @param {Number} x1 x-coor of first point
     * @param {Number} y1 y-coor of first point
     * @param {Number} z1 z-coor of first point
     * @param {Number} x2 x-coor of second point
     * @param {Number} y2 y-coor of second point
     * @param {Number} z2 z-coor of second point
     * @returns `true` if success, `false` if fail 
     */
    addEdge(x1, y1, z1, x2, y2, z2) {
        try {
            this.addPoint(x1, y1, z1)
            this.addPoint(x2, y2, z2)
            console.log(`Edge (${x1}, ${y1}, ${z1}) to (${x2}, ${y2}, ${z2}) added to Matrix`)
            return true
        } catch (error) {
            console.log("Not enough space in Matrix")
            return false
        }
        
    }

    /**
     * Multiplies this instance of a Matrix with another Matrix
     * @param {Matrix} second the second Matrix to multiply with
     * @throws Error if `second` is not an instance of `Matrix` or row count of `second` is
     * not the same as this instance
     * @returns a copy of the multiplied Matrix
     */
    multiplyMatrix(second) {
        if (!(second instanceof Matrix)) {
            throw new Error("second object not a matrix")
        }
        if (this.cols != second.rows) {
            throw new Error("second Matrix is not compatible")
        }
        var retMatrix = new Matrix(this.rows, second.cols)
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < second.cols; j++) {
                var sum = 0
                for (var w = 0; w < this.cols; w++) {
                    // console.log(`i:${i}\tw:${w}\tj:${j}`)
                    sum += this.arr[i][w] * second.arr[w][j]
                }
                retMatrix.setFirstNaN(sum)
            }
        }
        return retMatrix
    }

    /**
     * Sets the first instance of NaN to `number`
     * @param {Number} number a number to replace NaN with
     * @returns `true` if replacement is successful, `false` otherwise
     */
    setFirstNaN(number) {
        for (var a = 0; a < this.rows; a++) {
            for (var b = 0; b < this.cols; b++) {
                if (isNaN(this.arr[a][b])) {
                    this.arr[a][b] = number
                    return true
                }
            }
        }
        return false
    }

    /**
     * Creates an identity Matrix from current Matrix
     * @returns the identity Matrix
     */
    identityMatrix() {
        var b = (this.rows > this.cols) ? this.rows : this.cols
        var retMat = new Matrix(b, b)
        for (var i = 0; i < b; i++) {
            for (var w = 0; w < b; w++) {
                if (i == w) {
                    retMat.arr[i][w] = 1
                }else{
                    retMat.arr[i][w] = 0
                }
            }
        }
        return retMat
    }

    /**
     * Dilates the Matrix by the given values
     * @param {Number} a number to dilate x-coors by
     * @param {Number} b number to dilate y-coors by
     * @param {Number} c number to dilate z-coors by
     * @throws Error if `a` is undefined
     * @returns the dilated Matrix
     */
    dilate(a, b, c) {
        var idenMod = this.identityMatrix()
        if (a == undefined) {
            throw new Error("First value cannot be empty!")
        }
        b = (b == undefined) ? 1 : b
        c = (c == undefined) ? 1 : c
        for (i = 0; i < idenMod.rows; i++) {
            if (i % 3 == 0) {
                idenMod.arr[i][i] = a
            }
            if (i % 3 == 1) {
                idenMod.arr[i][i] = b
            }
            if (i % 3 == 2) {
                idenMod.arr[i][i] = c
            }
        }
        idenMod.arr[0][0] = a
        idenMod.arr[1][1] = b
        idenMod.arr[2][2] = c
        var nMod = idenMod.multiplyMatrix(this)
        return nMod
    }

    /**
     * Translates the Matrix by the given values
     * @param {Number} a number to translate x-coors by
     * @param {Number} b number to translate y-coors by
     * @param {Number} c number to translate z-coors by
     * @throws Error if `a` is undefined
     * @returns the translated Matrix
     */
    translate(a, b, c) {
        var idenMod = this.identityMatrix()
        if (a == undefined) {
            throw new Error("First value cannot be empty!")
        }
        b = (b == undefined) ? 0 : b
        c = (c == undefined) ? 0 : c
        idenMod.arr[0][idenMod.cols - 1] = a
        idenMod.arr[1][idenMod.cols - 1] = b
        idenMod.arr[2][idenMod.cols - 1] = c
        var nMod = idenMod.multiplyMatrix(this)
        return nMod
    }

    /**
     * Rotates the Matrix based on the given values
     * @param {Number} degree the degree of rotation
     * @param {String} axis the axis to rotate on. Can be `x`, `y`, or `z`
     * @throws Error if `degree` is not a number, or if `axis` is not `x`, `y`, or `z`
     * @returns the rotated Matrix
     */
    rotate(degree, axis) {
        if (isNaN(degree)) {
            throw new Error(`Degree is not a number. Given ${degree}`)
        }
        if (axis != 'x' && axis != 'y' && axis != 'z') {
            throw new Error(`Axis must be x, y, or z. Given ${axis}`)
        }
        var iden = this.identityMatrix()
        var cosx = Math.cos(degree * (Math.PI / 180)).toFixed(0)
        var sinx = Math.sin(degree * (Math.PI / 180)).toFixed(0)
        var nsinx = -sinx
        if (axis == 'x') {
            iden.arr[1][1] = cosx
            iden.arr[1][2] = nsinx
            iden.arr[2][1] = sinx
            iden.arr[2][2] = cosx
        }
        if (axis == 'y') {
            iden.arr[0][0] = cosx
            iden.arr[0][2] = sinx
            iden.arr[2][0] = nsinx
            iden.arr[2][2] = cosx
        }
        if (axis == 'z') {
            iden.arr[0][0] = cosx
            iden.arr[0][1] = nsinx
            iden.arr[1][0] = sinx
            iden.arr[1][1] = cosx
        }
        var nMod = this.multiplyMatrix(iden)
        return nMod
    }

}

/**
 * Does the script that is in the file
 * @param {File} f the script file
 * @param {Matrix} mainMatrix the main matrix
 * @param {Matrix} transformMatrix the transformation matrix
 */
function doScript(f,mainMatrix, transformMatrix) {
    console.log("reading line")
    var lines = fs.readFileSync(f).toString().split('\n')
    console.log(lines)
    console.log("line read")
    for (i = 0; i < lines.length - 1; ) {
        var currLine = lines[i].trim()
        var nextLine = lines[i + 1]
        console.log(lines[i])
        if (currLine != "line" && currLine != "ident" && currLine != "scale" && currLine != "move" && 
        currLine != "rotate" && currLine != "apply" && currLine != "display" && currLine != "save") { i++ }
        if (currLine == "line") {
            console.log("line")
            var sep = nextLine.split(' ')
            console.log(`this is sep:\n${sep}\n${sep[0]}`)
            mainMatrix.addEdge(sep[0], sep[1], sep[2], sep[3], sep[4], sep[5])
            i += 2
            continue
        }
        if (currLine == "ident") {
            console.log("iden")
            transformMatrix = mainMatrix.identityMatrix()
            console.log(transformMatrix.toString())
            i++
            continue
        }
        if (currLine == "scale") {
            console.log("scale")
            var sep = nextLine.split(' ')
            transformMatrix = transformMatrix.dilate(sep[0], sep[1], sep[2])
            console.log(transformMatrix.toString())
            i += 2
            continue
        }
        if (currLine == "move") {
            console.log("move")
            var sep = nextLine.split(' ')
            transformMatrix = transformMatrix.translate(sep[0], sep[1], sep[2])
            console.log(transformMatrix.toString())
            i += 2
            continue
        }
        if (currLine == "rotate") {
            console.log("rotate")
            var sep = nextLine.split(' ')
            transformMatrix = transformMatrix.rotate(sep[1], sep[0])
            console.log(transformMatrix.toString())
            i += 2
            continue
        }
        if (currLine == "apply") {
            console.log("apply")
            console.log(mainMatrix.toString())
            mainMatrix = mainMatrix.multiplyMatrix(transformMatrix)
            console.log(`main now:${mainMatrix.toString()}`)
            i++
            continue
        }
        if (currLine == "display") {
            // lineMaker.clear(1000)
            console.log("display")
            console.log(mainMatrix.toString())
            for (w = 0; w < mainMatrix.cols - 1; w++) {
                console.log(w)
                lineMaker.makeLine(mainMatrix.arr[0][w], mainMatrix.arr[1][w], mainMatrix.arr[0][w + 1], mainMatrix.arr[1][w + 1])
            }
            lineMaker.makeLine(mainMatrix.arr[0][mainMatrix.cols - 2], mainMatrix.arr[1][mainMatrix.cols - 2], mainMatrix.arr[0][mainMatrix.cols - 1], mainMatrix.arr[1][mainMatrix.cols - 1])
            const display = spawn('imdisplay.exe image.ppm')
            console.log(display.length)
            i++
            continue
        }
        if (currLine == "save") {
            // lineMaker.clear(1000)
            console.log("save")
            for (w = 0; w < mainMatrix.cols - 1; w++) {
                lineMaker.makeLine(mainMatrix.arr[0][w], mainMatrix.arr[1][w], mainMatrix.arr[0][w + 1], mainMatrix.arr[1][w + 1])
            }
            lineMaker.makeLine(mainMatrix.arr[0][mainMatrix.cols - 2], mainMatrix.arr[1][mainMatrix.cols - 2], mainMatrix.arr[0][mainMatrix.cols - 1], mainMatrix.arr[1][mainMatrix.cols - 1])
            lineMaker.imgWrite()
            console.log(`this is line: ${currLine} and this is lines + 1: ${nextLine}`)
            const display = spawn(`convert image.ppm ${nextLine.trim()}`)
            i += 2
            continue
        }
    }
}
function main() {

    // var turn = new Matrix(4, 4)
    // turn.addPoint(3, 3 , 3)
    // turn.addPoint(5, 5 , 5)
    // turn.addPoint(1, 1, 1)
    // turn.addPoint(2, 2, 2)
    // // turn.dilate(2)
    // // console.log(`This is translated:\n${turn.toString()}\nto\n${turn.translate(3, 2, 3).toString()}`)
    // console.log(`this is turn:\n${turn.toString()}`)
    // console.log(`this is turn:\n${turn.rotate(90, 'x').toString()}`)

    console.log("time to try to read")
    // console.clear()
    var m = new Matrix(4, 24)
    var t = new Matrix(4, 24)
    doScript('script', m, t)
    
    var a = new Matrix(4, 4)
    a.addPoint(1, 1, 1)
    a.addPoint(2, 2, 2)
    a.addPoint(3, 3, 3)
    a.addPoint(4, 4, 4)
    var b = a.translate(1, 2, 3)
    console.log(`a:\n${a.toString()}\n\nb:\n${b.toString()}`)
    a = b

}

main()
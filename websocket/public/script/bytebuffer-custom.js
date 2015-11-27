    ByteBuffer.prototype.readUTF8StringBytes = function(length, offset) {
        var advance = typeof offset == 'undefined';
        offset = typeof offset != 'undefined' ? offset : this.offset;
        var dec, result = "", start = offset;
        length = offset + length; // Limit
        while (offset < length) {
            dec = ByteBuffer.decodeUTF8Char(this, offset);
            offset += dec["length"];
            result += String.fromCharCode(dec["char"]);
        }
        if (offset != length) {
            throw(new Error("Actual string length differs from the specified: "+((offset>length ? "+" : "")+offset-length)+" bytes"));
        }
        if (advance) {
            this.offset = offset;
            return result;
        } else {
            return {
                "string": result,
                "length": offset-start
            }
        }
    };



    ByteBuffer.decodeUTF8Char = function(src, offset) {
    var a = src.readUint8(offset), b, c, d, start = offset, charCode;
    // ref: http://en.wikipedia.org/wiki/UTF-8#Description
    // It's quite huge but should be pretty fast.
    if ((a&0x80)==0) {
        charCode = a;
        offset += 1;
    } else if ((a&0xE0)==0xC0) {
        b = src.readUint8(offset+1);
        charCode = ((a&0x1F)<<6) | (b&0x3F);
        offset += 2;
    } else if ((a&0xF0)==0xE0) {
        b = src.readUint8(offset+1);
        c = src.readUint8(offset+2);
        charCode = ((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F);
        offset += 3;
    } else if ((a&0xF8)==0xF0) {
        b = src.readUint8(offset+1);
        c = src.readUint8(offset+2);
        d = src.readUint8(offset+3);
        charCode = ((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F);
        offset += 4;
    } else {
        throw(new Error("Cannot decode UTF8 character at offset "+offset+": charCode (0x"+a.toString(16)+") is invalid"));
    }
    return {
        "char": charCode ,
        "length": offset-start
    };
   };


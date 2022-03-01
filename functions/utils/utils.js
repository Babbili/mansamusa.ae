exports.updateProducts = function (data, objectID) {

    let categories = {}

    let lang = [...new Set(data.categoryPicker.productCategories.map(m => Object.keys(m)).flat(1))]

    lang.map(l => {

        let allCats = data.categoryPicker.productCategories.map(m => m[l])

        let c = {}

        allCats.map((m, i) => {
            let temp = [...allCats]
            c = {...c, [`lvl${i}`]: temp.splice(0, i + 1).join(' > ')}
            return c
        })

        categories = {...categories, [l]: c}

        return null

    })

    let titles = data.offers.map(offer => {
        return offer.options.map(option => {
            return option.title
        })
    }).flat(1)

    let uniqTitles = titles.filter((title, index, self) =>
        index === self.findIndex((t) => (
            t.en === title.en && t.ar === title.ar
        ))
    )

    let opt = uniqTitles.map(m => {

        return data.offers.map(offer => {

            return offer.options.map(option => {

                if (m.en === option.title.en) {

                    return {
                        title: m,
                        options: option.items.map(m => m.value)
                    }

                }

                return null

            })

        })

    }).flat(2)
        .filter(f => f !== null)

    let uniq = uniqTitles.map(m => {

        let title = m
        let options = []

        opt.map(o => {
            if (o.title.en === m.en) {
                options = [...new Set([...options, ...o.options])]
            }
            return null
        })

        return {
            title: title,
            [title.en]: options.filter((f, index, self) =>
                index === self.findIndex((t) => typeof t !== 'string' ? t.en === f.en : t === f)
            ),
            [title.ar]: options.filter((f, index, self) =>
                index === self.findIndex((t) => typeof t !== 'string' ? t.en === f.en : t === f)
            )
        }

    })

    return {
        objectID: objectID,
        id: objectID,
        title: data.productName,
        description: data.productDescription,
        categories: data.categoryPicker.productCategories,
        image: data.productImages.length > 0 ? data.productImages[0].url : '',
        hierarchicalCategories: categories,
        options: uniq,
        ...data
    }

}

exports.moveFirebaseFile = async (tmpPath, prodPath) => {

    const loadBlob = async (url) => {
        return new Promise( (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload  = () => resolve(xhr.response);
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        });
    }

    return await tmpPath
    .getDownloadURL()
    .then(url => {
        let file = loadBlob(url)

        return prodPath.put(file)
        .then(snapshot => {
            return snapshot.ref.getDownloadURL()
            .then(url => {
                tmpPath.delete().then(r => {})
                return url
            })
        })

    })

}
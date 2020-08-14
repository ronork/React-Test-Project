export default function genlocationParams() {
    let params = (new URL(document.location)).searchParams

    return {
        'cat': params.get('cat'),
        'time': params.get('time'),
        'search': params.get('search')
    };
}
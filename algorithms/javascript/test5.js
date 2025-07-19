function solution(N) {
    let fibSeries = [0, 1];

    for(i=2; i<N; i++){
        //fibSeries[i] = fibSeries[i-1] + fibSeries[i-2];
        fibSeries.push(fibSeries[i-1] + fibSeries[i-2]);
    }

    return fibSeries;
}

console.log(solution(10));
